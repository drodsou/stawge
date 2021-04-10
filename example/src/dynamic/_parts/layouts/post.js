
const __dirname = new URL('.', import.meta.url).pathname;

export default (props) => {
  // force re-import each time so incremental modification of main layout is reflected here too
  // TODO: make this more elegant/performant with stawge util.importPart ?
  const layoutMain = await import(`file://${__dirname}/main.js?${Math.random()}`);
  return layoutMain({
    ...props, 
    body: /*html*/`
      <article class="post-container">
        ${props.body}
      </article>
    `
  }) 
};

