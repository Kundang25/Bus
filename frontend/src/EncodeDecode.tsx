export const encodeWithBase64 = (text) => {
    const encoder = new TextEncoder();
    const utf8Array = encoder.encode(text);
    const base64String = btoa(String.fromCharCode(...utf8Array));
    return base64String;
  }
  
  export const decodeWithBase64 = (base64String) => {
    const isBase64 = (str) => {
      if (typeof str !== 'string') {
        return false;
      }
      const base64Regex = /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      return base64Regex.test(str);
    };
    if (!isBase64(base64String)) {
      console.warn("Provided string is not valid Base64:", base64String);
      return base64String;
    }
    try {
      const cleanBase64 = base64String.replace(/[^A-Za-z0-9+/=]/g, '');
      const binaryString = atob(cleanBase64);
      const binaryArray = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
      const decoder = new TextDecoder();
      return decoder.decode(binaryArray);
    } catch (error) {
      console.error("Error decoding Base64 string:", base64String, error);
      return base64String; // Fallback to the original string
    }
  };