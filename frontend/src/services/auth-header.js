export default function authHeader(token) {
    let user = JSON.parse(localStorage.getItem('user'));

    if(token){
      return { 'x-access-token': token }
    }
  
    if (user && user.accessToken) {
      return { 'x-access-token': user.accessToken };
    } else {
      return {};
    }
}