import layoutMain from './main.js';
export default (props) => layoutMain({
  ...props, 
  body: /*html*/`
    <div class="post-container">
      ${props.body}
    </div>
  `
});

