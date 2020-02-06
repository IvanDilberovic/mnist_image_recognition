import React, { Component } from "react";
import "./About.css";

class About extends Component {
  render() {
    return (
      <div className="center pb6">
        <article className="pa2 pa2-ns">
          <h1 className="f2">MNIST image recognition</h1>
          <img
            src="https://www.pyimagesearch.com/wp-content/uploads/2014/06/mnist_sample.jpg"
            className="w-100 f5 measure"
            alt=""
          />
          <p className="measure lh-copy center tj green">
            The LeNet architecture was first introduced by LeCun et al. in their
            1998 paper, Gradient-Based Learning Applied to Document Recognition.
            As the name of the paper suggests, the authors’ implementation of
            LeNet was used primarily for OCR and character recognition in
            documents. The LeNet architecture is straightforward and small, (in
            terms of memory footprint), making it perfect for teaching the
            basics of CNNs — it can even run on the CPU (if your system does not
            have a suitable GPU), making it a great “first CNN”.
          </p>
          <img
            src="https://www.pyimagesearch.com/wp-content/uploads/2016/06/lenet_architecture-768x226.png"
            className="w-100 f5 measure"
            alt=""
          />
          <p className="measure lh-copy center tj green">
            The LeNet architecture is an excellent “first architecture” for
            Convolutional Neural Networks (especially when trained on the MNIST
            dataset, an image dataset for handwritten digit recognition). LeNet
            is small and easy to understand — yet large enough to provide
            interesting results. Furthermore, the combination of LeNet + MNIST
            is able to run on the CPU, making it easy for beginners to take
            their first step in Deep Learning and Convolutional Neural Networks.
            In many ways, LeNet + MNIST is the “Hello, World” equivalent of Deep
            Learning for image classification.
          </p>
        </article>
      </div>
    );
  }
}

export default About;
