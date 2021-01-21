import axios from 'axios';

export default {
    Account_create: async(root,args,context,info) => {
        const {firstName,lastName,description} = args;

        var user = {
            firstName:firstName,
            lastName:lastName,
            description:description
        }

        var response = await axios.post('http://localhost:3501/v1.0/invoke/identity/method/account', user)
        
        return JSON.stringify(response.data);
        
    }
}