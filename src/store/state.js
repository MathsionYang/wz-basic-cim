// ζζηΆζ
const state = {
  userInfo: JSON.parse(sessionStorage.getItem('user')) || {},
  isLoading: false,
  resize: {
    width: window.screen.offsetWidth,
    height: document.body.offsetHeight
  }
}
export default state
