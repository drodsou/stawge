
// TODO: async import() so it works on main.js incremental reload, using cfg.util.importRound

import layoutMain from './main.js';
export default (props) => layoutMain({
  ...props, 
  body: /*html*/`
    <div class="post-container">
      ${props.body}
    </div>
  `
});

