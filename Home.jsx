import React, { useState } from "react";
import img1 from "../assets/banner_1.jpg";
import img2 from "../assets/index2.jpeg";
import img3 from "../assets/index1.jpeg";
import img4 from "../assets/Home/hpc-thumbnail.jpeg";



function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevSlide = () => {
    const newIndex = activeIndex === 0 ? 2 : activeIndex - 1;
    setActiveIndex(newIndex);
  };
  
  const nextSlide = () => {
    const newIndex = activeIndex === 2 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
  };
  
   
  return (
    <>
      <div
        id="carouselExampleControls"
        className="carousel slide mb-2 "
        data-ride="carousel"
      >
        <div
          className="carousel-inner mb-5" 
          style={{ width: "100%", height: "90%" }}
        >
          <div className={`carousel-item ${activeIndex === 0 ? "active" : ""}`}>
            <img className="d-block w-100" src={img1} alt="First slide" />
          </div>
          <div className={`carousel-item ${activeIndex === 1 ? "active" : ""}`}>
            <img className="d-block w-100" src={img2} alt="Second slide" />
          </div>
          <div className={`carousel-item ${activeIndex === 2 ? "active" : ""}`}>
            <img className="d-block w-100" src={img3} alt="Third slide" />
          </div>
        </div>
        <a
          className="carousel-control-prev"
          href="#carouselExampleControls"
          role="button"
          data-slide="prev"
          onClick={prevSlide}
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#carouselExampleControls"
          role="button"
          data-slide="next"
          onClick={nextSlide}
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Next</span>
        </a>

        <div
          className="jumbotron"
          style={{ paddingLeft: "205px", paddingRight: "205px" }}
        >
          {/* style={{  paddingLeft:'205px', paddingRight:'205px' }} */}
    {/* ............. */}

          <h1
            className="h1. display-5 text-center mb-4 fw-normal "
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            PARAM SHAVAK
          </h1>

          <div className="container">
            <div className="text">
              <div className="mb-5  text-black shadow-2xl p-4 bg-body rounded w-[90%] flex flex-col gap-3">

              <ul className=" text-xl">
                  <li>A Compact and Supercomputing in a Box Solution </li>
                  <li>Indigenously Designed using the C-DAC Rudra Board</li>
                </ul>
              <p className="">
                An HPC cluster is a distributed computing system comprising
                interconnected high-performance computers, designed to
                collectively execute computationally intensive tasks such as
                complex simulations or large-scale data analysis with
                significantly improved speed and efficiency compared to
                individual computing nodes. .
              </p>
              </div>
            </div>
            <div
              className="image mb-4"
              style={{ width: "80%", height: "100%" }}
            >
              <img src={img4} alt="Paris" />
            </div>
          </div>

          {/* 
    <div className="container">
      <div className="image mb-4">
        <img src={img1} alt="Paris"/>
      </div>
      <div className="text">
        <h1>Paris is one of the most magnificent cities in France.</h1>
      </div>
    </div>  */}

          <style>
            {`
       .container {
        display: flex;
        align-items: center;
        justify-content: center
   
       
      }


     

       `}
          </style>
        </div>
      </div>
    </>
  );
}

export default Home;
