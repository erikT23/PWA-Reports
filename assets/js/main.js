/**
 * Template Name: NiceAdmin
 * Updated: Sep 18 2023 with Bootstrap v5.3.2
 * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

let swReg;
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then(swRegRes=>{
    swReg = swRegRes;
    swReg.pushManager.getSubscription().then(verifyNotifications)
  })
}

const verifyNotifications = (activated)=>{
  console.log(activated);
  if (activated) {
    console.log("true");
    $('#notifyActivated').css('display', 'block')
    $('#notifyDeactivated').css('display', 'none')
  }else{
    console.log("false");
    $('#notifyDeactivated').css('display', 'block')
    $('#notifyActivated').css('display', 'none')

  }

}


const parseJWT = () =>{
  const token = localStorage.getItem('token');;
  const payload = token.split('.')[1]
  const base64 = payload.replace(/-/g,'+').replace(/_/g, '/');
  const user = decodeURIComponent(window.atob(base64).split('').map(
    c=>{
      return `%${('00'+c.charCodeAt(0).toString(16)).slice(-2)}`
    }
  ).join(''))
  return JSON.parse(user)
}

$(document).on('click', "#notifications", async ()=>{
  console.log("Entro en el onclick");
    try{
      const subscription = await swReg.pushManager.getSubscription();
      if(subscription){
        subscription.unsubscribe().then(() => verifyNotifications(false));
        return 
      }
      if(!swReg) return;
      const response = await axiosClient.get('/notification/',{
        responseType: 'arraybuffer'
      })
      const data = new Uint8Array(response)
      swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: data
      }).then((res) => res.toJson())
      .then((subscription) =>{
        console.log(subscription);
        const user = parseJWT();
        axiosClient.post('/notification/',{
          id: user.id,
          userDetails: {subscription}
        }).then((res) => verifyNotifications(res['updated']))
        .catch((res) =>{
          swReg.pushManager.getSubscription().then((subscription) =>{
            subscription.unsubscribe.then(()=>verifyNotifications(false));
          })
        })
      })
    }catch(error){

    }
})



var fullname = ``;
var role = ``;
const changeView = (role) => {
  role = role;
  switch (role) {
    case 'DIRECTOR':
      window.location.href = '/pages/admin/home.html';
      console.log('DIRECTOR');
      break;
    case 'ENCARGADO':
      window.location.href = '/pages/attendant/home.html';
      break;
    case 'EMPLEADO':
      window.location.href = '/pages/docent/home.html';
      break;
    default:
      window.location.href = '/index.html';
      localStorage.clear();
      role = '';
  }
};

const logout = () => {
  localStorage.clear();
  changeView('');
};

(function () {
  'use strict';

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach((e) => e.addEventListener(type, listener));
    } else {
      select(el, all).addEventListener(type, listener);
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Sidebar toggle
   */
  if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function (e) {
      select('body').classList.toggle('toggle-sidebar');
    });
  }

  /**
   * Search bar toggle
   */
  if (select('.search-bar-toggle')) {
    on('click', '.search-bar-toggle', function (e) {
      select('.search-bar').classList.toggle('search-bar-show');
    });
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header');
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled');
      } else {
        selectHeader.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Initiate tooltips
   */
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  /**
   * Initiate quill editors
   */
  if (select('.quill-editor-default')) {
    new Quill('.quill-editor-default', {
      theme: 'snow',
    });
  }

  if (select('.quill-editor-bubble')) {
    new Quill('.quill-editor-bubble', {
      theme: 'bubble',
    });
  }

  if (select('.quill-editor-full')) {
    new Quill('.quill-editor-full', {
      modules: {
        toolbar: [
          [
            {
              font: [],
            },
            {
              size: [],
            },
          ],
          ['bold', 'italic', 'underline', 'strike'],
          [
            {
              color: [],
            },
            {
              background: [],
            },
          ],
          [
            {
              script: 'super',
            },
            {
              script: 'sub',
            },
          ],
          [
            {
              list: 'ordered',
            },
            {
              list: 'bullet',
            },
            {
              indent: '-1',
            },
            {
              indent: '+1',
            },
          ],
          [
            'direction',
            {
              align: [],
            },
          ],
          ['link', 'image', 'video'],
          ['clean'],
        ],
      },
      theme: 'snow',
    });
  }

  /**
   * Initiate Bootstrap validation check
   */
  var needsValidation = document.querySelectorAll('.needs-validation');

  Array.prototype.slice.call(needsValidation).forEach(function (form) {
    form.addEventListener(
      'submit',
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      },
      false
    );
  });

  /**
   * Initiate Datatables
   */
  // const datatables = select('.datatable', true);
  // datatables.forEach((datatable) => {
  //   new DataTable(datatable, {
  //     columnDefs: [{ orderable: false, targets: 0 }],
  //     language: {
  //       url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
  //     },
  //   });
  // });

  /**
   * Autoresize echart charts
   */
  const mainContainer = select('#main');
  if (mainContainer) {
    setTimeout(() => {
      new ResizeObserver(function () {
        select('.echart', true).forEach((getEchart) => {
          echarts.getInstanceByDom(getEchart).resize();
        });
      }).observe(mainContainer);
    }, 200);
  }
})();
