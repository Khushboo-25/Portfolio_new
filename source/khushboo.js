let seacrhForm=document.querySelector('.search-form');

document.querySelector('#search-btn').onclick=()=>{
    seacrhForm.classList.toggle('active');
    // seacrhForm.classList.remove('active');
    navbar.classList.remove('active');
}


let navbar=document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick=()=>{
    navbar.classList.toggle('active');
    seacrhForm.classList.remove('active');
    
}

window.onscroll=()=>{
    seacrhForm.classList.remove('active');
    
    navbar.classList.remove('active');
}

document.addEventListener("DOMContentLoaded", function () {
  var mySwiper = new Swiper('.swiper.work-slider', {
    loop:true,
  spaceBetween: 20,
  autoplay:{
      delay: 5000,
      disableOnInteraction:false,
  },
  
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1020: {
      slidesPerView: 3,
    },
  },
  });
});


AOS.init({
  duration:1000
})