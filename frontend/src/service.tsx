import axios from "axios";

const FSServerIP = "http://192.168.1.109:8086/";

export const BridgeandReport = async(formData, api)=>{
try{
    return axios({
        method: "post",
        url: FSServerIP + api,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}catch(e){

}
}