import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import colors from 'vuetify/util/colors';

import { mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  //@ts-ignore
  icons: {
    sets: {
      mdi,
    },
  },
  components: {
    ...components,
  },
  directives,
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.blue.base,
          secondary: colors.red.lighten4,
        },
      },
    },
  },
});
