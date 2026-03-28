const user = ref<any>(null);

const parseToken = () => {
  if (!token.value) return;

  const payload = JSON.parse(atob(token.value.split(".")[1]));
  user.value = payload;
};
