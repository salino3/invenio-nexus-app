export class ServicesApp {
  // Books

  //
  public static async serviceLoginAccount(): Promise<
     
  > {
    return await fetch(CONSTANTS_APP.url_back  ).catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
  }
}
