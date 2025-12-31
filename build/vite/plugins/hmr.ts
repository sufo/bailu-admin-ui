
/**
 * HMR  
 * TODO
 */
export default function hmrPlugin() {
  return {
    name: 'singleHMR',
    handleHotUpdate({ modules, file }: any) {
      if (file.match(/xml$/)) return [];

      modules.forEach((m: any) => {
        if (!m.url.match(/\.(css|less)/)) {
          m.importedModules = new Set();
          m.importers = new Set();
        }
      });

      return modules;
    },
  }
}