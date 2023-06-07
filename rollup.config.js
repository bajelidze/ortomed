import commonjs from '@rollup/plugin-commonjs';

export default {
  plugins: [
    commonjs({
      dynamicRequireTargets: [
        '/home/ib/Code/ortomed/build/better_sqlite3.node',
      ],
    }),
  ],
};
