const admin = {
    EMAIL : 'admin',
    PASSWORD : '1234',
    ROLE : 'admin'
}

const user = {
    EMAIL : 'user@naver.com',
    PASSWORD : '1234',
    ROLE : 'user'
}

export const signIn = (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(email === admin.EMAIL && password === admin.PASSWORD){
                resolve(admin);
            }else if(email === user.EMAIL && password === user.PASSWORD){
                resolve(user)
            }else{
                reject("The email or password is wrong");
            }
        })
    })
}