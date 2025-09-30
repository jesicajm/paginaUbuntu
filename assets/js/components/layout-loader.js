
export const LayoutLoader = {
    async loadComponent(id, file) {
      try {
        const res = await fetch(file);
        const html = await res.text();
        document.getElementById(id).innerHTML = html;
      } catch (err) {
        console.error(`Error al cargar ${file}:`, err);
      }
    },
  
    async init() {
      await this.loadComponent('header-placeholder', '../components/header.html');
      await this.loadComponent('footer-placeholder', '../components/footer.html');
    }
  };
  