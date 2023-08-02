import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDataTable } from 'vuetify/labs/VDataTable';
import 'vuetify/styles';

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
    VDataTable,
  },
  directives,
});
