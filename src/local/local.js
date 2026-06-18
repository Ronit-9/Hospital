






export const setUserToLocal = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
}



export const getUserFromLocal = () => {
  const users = localStorage.getItem('users');
  return users === null ? [] : JSON.parse(users);

}