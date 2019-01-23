import Vue from 'vue';
import { default as format } from 'date-fns/format';

Vue.filter('dateformat', date => {
  return format(new Date(date), 'MMMM D, YYYY');
});
