export default function({ store, redirect }) {
  if (! store.getters['api/isAuth']) {
    redirect({ name: 'login' });
  }
}
