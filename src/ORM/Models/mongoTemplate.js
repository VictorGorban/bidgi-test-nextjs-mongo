//* Что это за файл? Здесь работа с MongoDB через ORM. Mongoose не подошел из-за неудобства в некоторых сценариях, плюс из-за общего снижения производительности.
//* Здесь же объединена скорость нативного драйвера с необходимой в наших проектах гибкостью.

import _ from "lodash";
import { logDBAction, logDBError } from "@src/serverHelpers/logActions";
import * as commonHelpers from "@main/commonHelpers";
import * as serverHelpers from "@main/serverHelpers";

global.DBCollections = global.DBCollections || {};

export default class Template {
  /**
   * object schema to check on insert/update
   */
  static get schema() {
    return null;
  }

  /**
   * Boolean, whether to use oplog on insert, update, delete, and indexes.
   */
  static get mustSkipOplog() {
    return false;
  }

  /**
   * Timestamps - это поля updatedAt и createdAt, также возможно deletedAt
   */
  static get mustSkipTimestamps() {
    return false;
  }

  /**
   * skip collection sync? True if this is a service collection, like oplog, syncCheckpoints or so.
   */
  static get mustSkipCollectionSync() {
    return false;
  }

  static get generateDocumentId() {
    return commonHelpers.randomString;
  }

  /**
   * Список collectionindexes для создания. Почему я ушел в плане индексов от mongoose: mongoose не позволяет декларативно создавать сложные индексы
   * [{definition: {}, options: {}}]
   */
  static get indexes() {
    return [];
  }

  /**
   * опции для создания коллекции. Например, {collation: {locale: 'en', strength: 2}} - таким образом _id будет case-insensitive.
   */
  static get collectionOptions() {
    return {};
  }

  /**
   * Название коллекции в db mongo
   */
  // в классе: static collectionName = "";
  static get collectionName() {
    return "";
  }

  static get collection() {
    // пришлось сделать через функцию, т.к. переменная внутри класса оказывается новее этой же переменной, но вне класса. Возможно, это из-за статического импорта.
    return global.DBCollections[this.collectionName];
  }
  static set collection(newValue) {
    global.DBCollections[this.collectionName] = newValue;
  }

  /**
   * @unused
   */
  static helpers = {};

  /**
   * find a document matching the query.
   * @returns - then-able cursor, containing the found document or null
   * @param {Object} query - filter query
   * @param {Object} projection - filter query
   */
  static findOne(query, projection) {
    try {
      if (!query) query = {};
      if (typeof query != "object") {
        query = { _id: query };
      }

      return this.collection.findOne(query, projection);
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  /**
   * find documents matching the query.
   * @returns - then-able cursor, containing documents
   * @param {Object} query - filter query
   * @param {Object} projection - filter query
   */
  static find(query, projection) {
    try {
      if (Array.isArray(query)) {
        query = { _id: { $in: query } };
      }

      let cursor = this.collection.find(query, projection);

      return cursor;
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  /**
   * get count of documents matching the query.
   * @returns - then-able cursor, containing documents count
   * @param {Object} query - filter query
   */
  static async count(query) {
    try {
      await global.getDBInitialized();

      return this.collection.countDocuments(query);
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  /**
   * create collection index. If exists, replace it.
   * @returns {Promise<Object>} then-able cursor, creation info
   * @param {Object} definition - index definition, like { category: 1 }
   * @param {Object} options - index options, like { unique: true, sparse: true }
   * @param {Object} options.collation - index collation, like { locale: "en", strength: 2 } } - case-insensitive index.
   * @comment по умолчанию коллекция создается с collation={locale: 'simple'}, и все find по умолчанию используют collation коллекции.
   * @comment более того, индексы _id требует то же collation что и коллекция, поэтому для case-insensitive поиска _id нужна коллекция с соотв. collation.
   */
  static async createIndex(definition, options) {
    try {
      let result = await this.collection.createIndex(definition, options);
      logDBAction(this.collectionName + ".createIndex", arguments);
      return result;
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  /**
   * drops specified index
   * @returns {Promise<Object>} then-able cursor, index drop info
   * @param {string|Object} options - index name or index specification document like { "cat" : -1 }
   */
  static async removeIndex(index) {
    try {
      let result = await this.collection.dropIndex(index);
      logDBAction(this.collectionName + ".removeIndex", arguments);

      return result;
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  // function (documents)
  static get beforeInsert() {
    return null;
  }

  // function (documents)
  static get afterInsert() {
    return null;
  }

  /**
   * insert one document
   * @returns {Promise<Object>} insert info
   * @param {Object} document - document to insert
   */
  static async insertOne(document, validate = true) {
    try {
      await global.getDBInitialized();
      if (Array.isArray(document)) {
        throw new Error("Ожидается один документ для вставки");
      }

      if (!document._id) {
        document._id = this.generateDocumentId();
      }
      if (!this.mustSkipTimestamps) {
        if (!document.createdAt) {
          document.createdAt = new Date();
        }
        if (!document.updatedAt) {
          document.updatedAt = new Date();
        }
      }

      if (validate && this.schema) {
        this.schema.clean(document, { mutate: true });
        this.schema.validate(document);
      }

      await this.beforeInsert?.(document);

      let result = await this.collection.insertOne(document);
      logDBAction(this.collectionName + ".insert", arguments);
      
      this.afterInsert?.(document);
      // если вставляется один документ как объект, то возвращается документ, а не массив.
      return document || null;
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  /**
   * insert many documents
   * @returns {Promise<Object>} insert info
   * @param {Array<Object>} documents - document to insert
   */
  static async insertMany(documents, validate = true) {
    try {
      await global.getDBInitialized();

      if (!Array.isArray(documents)) {
        throw new Error("Ожидается массив документов для вставки");
      }

      for (let document of documents) {
        if (!document._id) {
          document._id = this.generateDocumentId();
        }
        if (!this.mustSkipTimestamps) {
          if (!document.createdAt) {
            document.createdAt = new Date();
          }
          if (!document.updatedAt) {
            document.updatedAt = new Date();
          }
        }
      }

      if (validate && this.schema) {
        this.schema.clean(documents, { mutate: true });
        this.schema.validate(documents);
      }

      await this.beforeInsert?.(documents);

      let result = await this.collection.insertMany(documents);
      logDBAction(this.collectionName + ".insert", arguments);
      
      this.afterInsert?.(documents);
      return documents;
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  // function (query, updateQuery, options)
  static get beforeUpdate() {
    return null;
  }

  // function (query, updateQuery, options)
  static get afterUpdate() {
    return null;
  }

  /**
   * update one document (options.multi is false)
   * @returns {Promise<Object>} update info
   * @param {Object} query - find query
   * @param {Object|Array<Object>} updateQuery - list of update operations in form of Object or Array of objects
   * @param {Object} [options={}] - options
   */
  static async updateOne(
    query,
    updateQuery,
    options = { returnUpdatedDocs: true },
    validate = true
  ) {
    try {
      await global.getDBInitialized();
      options.multi = false;

      if (!query) query = {};
      if (typeof query != "object") {
        query = { _id: query };
      }

      if (!this.mustSkipTimestamps) {
        if (!_.get(updateQuery, "$set.updatedAt")) {
          _.set(updateQuery, "$set.updatedAt", new Date());
        }
      }

      if (validate && this.schema) {
        this.schema.clean(updateQuery, { mutate: true, isModifier: true });
        this.schema.validate(updateQuery, { modifier: true });
      }

      await this.beforeUpdate?.(query, updateQuery, options);
      let prevState = await this.findOne(query); // findOne и updateOne работают по одинаковой логике - берут первый подходящий. Так что они возьмут одинаковый объект, даже если не будет указан _id
      if (!prevState) {
        throw new Error(
          `No previous state for ${JSON.stringify(query)} in collection ${
            this.collectionName
          }`
        );
      }

      let result = await this.collection.updateOne(query, updateQuery, options);
      logDBAction(this.collectionName + ".update", arguments);

      if (options.returnUpdatedDocs) {
        result.affectedDocuments = await this.findOne(query);
      }
      return result;
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  /**
   * update many documents
   * @returns {Promise<Object>} update info
   * @param {Object} query - find query
   * @param {Object|Array<Object>} updateQuery - list of update operations in form of Object or Array of objects (aggregation).
   * @param {Object} [options={}] - options
   */
  static async updateMany(
    query,
    updateQuery,
    options = { returnUpdatedDocs: true },
    validate = true
  ) {
    try {
      await global.getDBInitialized();
      options.multi = true;

      if (!query) query = {};
      if (Array.isArray(query)) {
        query = { _id: { $in: query } };
      }

      
      if (!this.mustSkipTimestamps) {
        if (!_.get(updateQuery, "$set.updatedAt")) {
          _.set(updateQuery, "$set.updatedAt", new Date());
        }
      }

      if (validate && this.schema) {
        this.schema.clean(updateQuery, { mutate: true, isModifier: true });
        this.schema.validate(updateQuery, { modifier: true });
      }

      
      await this.beforeUpdate?.(query, updateQuery, options);

      let result = await this.collection.updateMany(
        query,
        updateQuery,
        options
      );
      logDBAction(this.collectionName + ".update", arguments);
      
      if (options.returnUpdatedDocs) {
        result.affectedDocuments = await this.find(query);
      }
      return result;
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  /**
   * delete one document
   * @returns {Promise<Object>} delete info
   * @param {Object} query - find query
   * @param {Object} [options={}] - options
   */
  static async removeOne(query, options = {}) {
    try {
      await global.getDBInitialized();
      options.multi = false;

      if (!query) query = {};
      if (typeof query != "object") {
        query = { _id: query };
      }

      await this.beforeRemove?.(query, options);
      
      let result = await this.collection.deleteOne(query, options);
      logDBAction(this.collectionName + ".remove", arguments);
      
      return result;
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  /**
   * delete many documents
   * @returns {Promise<Object>} delete info
   * @param {Object} query - find query
   * @param {Object} [options={}] - options
   */
  static async removeMany(query, options = {}) {
    try {
      await global.getDBInitialized();
      options.multi = true;

      if (!query) query = {};
      if (Array.isArray(query)) {
        query = { _id: { $in: query } };
      }

      await this.beforeRemove?.(query, options);

      let result = await this.collection.deleteMany(query, options);
      logDBAction(this.collectionName + ".remove", arguments);
      
      return result;
    } catch (e) {
      logDBError(null, e, arguments);
      throw e;
    }
  }

  // function (query, options)
  static get beforeRemove() {
    return null;
  }

  // function (query, options)
  static get afterRemove() {
    return null;
  }
}
