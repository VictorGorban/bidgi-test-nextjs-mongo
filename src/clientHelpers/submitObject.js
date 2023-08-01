//* секция Библиотеки c функциями
import axios from "axios";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты


export default async function submitJsonOrFormData(
  url,
  data = null,
  {
    timeout = 5000,
    maxAttemps = 1,
    baseUrl = "",
    method = "post",
    setUploadPercent = null,
    customAbortController = null,
  } = {}
) {
  // console.log("baseUrl", baseUrl);
  try {
    let response = null;

    console.log("submitObject", url, data);

    /* if(contentType == 'application/json'){
      data = JSON.stringify(data)
    } */

    function onUploadProgress(progressEvent) {
      let percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      // console.log("onUploadProgress", percentCompleted);
      setUploadPercent?.(percentCompleted);
    }

    for (let i = 0; i < maxAttemps; i++) {
      let isTimeoutError = false;
      try {
        const controller = new AbortController();
        if (customAbortController) {
          customAbortController.signal.addEventListener("abort", () =>
            controller.abort()
          );
        }
        //* timeout:
        const timeoutId =
          timeout &&
          setTimeout(() => {
            isTimeoutError = true;
            controller.abort();
          }, timeout);
        response = await axios[method](baseUrl + url, data, {
          signal: controller.signal,
          validateStatus: false,
          onUploadProgress,
        });
        if (timeoutId) clearTimeout(timeoutId);
      } catch (e) {
        if (isTimeoutError) {
          e.message = `Timeout exceeded ${timeout / 1000}s`;
        }
        throw e;
      }

      //* если успех, то прерываем цикл попыток
      break;
    }

    if (!response) {
      throw new Error("No response received.");
    }

    let postResult;
    try {
      postResult = await response.data;
      console.log("postResult", postResult);
    } catch (e) {
      console.log("Error while response.json()");
    }

    if (postResult.status == "error") {
      throw new Error(postResult.message || JSON.stringify(postResult));
    }

    if (response.status >= 400) {
      throw new Error(
        postResult.message ||
          response.statusText ||
          "Http sending error " + response.status
      );
    }

    // console.log("submitObject result", postResult);

    return postResult.data;
  } catch (e) {
    // таймаут мы отлавливаем, поэтому canceled может быть только по причине вызова customAbortController.abort()
    if (e.message == "canceled") {
      e.message = "Request canceled";
    }
    throw e;
  } finally {
  }
}
