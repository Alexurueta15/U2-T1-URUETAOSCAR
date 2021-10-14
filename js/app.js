let principal = $('#principal');
let notice = $('#notice');
let btnRegresar = $('.btn-regresar')

$('.btn-seguir').on('click', function (e){
    e.preventDefault();
    console.log("btn-seguir touched");
    principal.fadeOut(function (){
        btnRegresar.fadeIn();
        notice.slideDown(1000);
    });
});
btnRegresar.on('click', function (e){
    e.preventDefault();
    console.log("btn-seguir touched");
    notice.fadeOut(function (){
        principal.slideDown(1000);
    });
})

const swDirector =
    window.location.href.includes("localhost") ? "/sw.js" : "/U2-T1-URUETAOSCAR/sw.js";

if (navigator.serviceWorker){
    navigator.serviceWorker.register(swDirector);
}

