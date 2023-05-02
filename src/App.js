import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import img from "./img.png"
import './App.css'

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm();

  const [apiError, setApiError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

const resetState = (state)=>{
  setTimeout(()=>{
    state(false)
  }, 5000)
}
  const onSubmit = () => {
    const data = {
      id: nanoid(),
      name: getValues("name"),
      email: getValues("email"),
      subject: getValues("subject"),
      message: getValues("message"),
    };

    fetch(
      "https://my-json-server.typicode.com/tundeojediran/contacts-api-server/inquiries",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    )
      .then((Response) => {
        if (!Response.ok || Response.status !== 201) {
          throw new Error("Submission not successful");
        }
        return Response.json();
      })
      .then((submitted) => {
        setSubmitted(true);
        // setApiError(null);
        resetState(setSubmitted)
        // setTimeout(()=>{
        //   setSubmitted(false)
        // }, 5000)
        reset();
      })
      .catch((apiError) => {
        setApiError(true);
        // setSubmitted(false);
        resetState(setApiError)
      });

    return new Promise((resolve) => { // what is this for?
      setTimeout(() => {
        resolve();
      }, 4000);
    });
  };

  return (
    <div className="parent">
      <div className="imgContainer">
        <img src={img}></img>
      </div>
      <div className="formContainer">
        {submitted && (
          <div className="formSubmitted">Form submitted Successfully!</div>
        )}
        {apiError && (
          <div className="formNotSubmitted">
            Form not submitted. Please try again!
          </div>
        )}
        <h2 className="contactUs">CONTACT US</h2>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="nameInput">
            <label htmlFor="name">
              Full Name<sup style={{ color: "rgb(170, 57, 57)" }}>*</sup>
            </label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Input your name",
                maxLength: 80,
              })}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name?.type === "required" && (
              <p role="alert" className="errorMsg">
                {errors.name?.message}
              </p>
            )}
          </div>

          <div className="emailInput">
            <label htmlFor="email">
              Email Address<sup style={{ color: "rgb(170, 57, 57)" }}>*</sup>
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email Address is required",
                pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              })}
              aria-invalid={errors.email ? "true" : "false"}
            />

            {errors.email?.type === "required" && (
              <p role="alert" className="errorMsg">
                {errors.email?.message}
              </p>
            )}
          </div>

          <div className="subjectInput">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" {...register("subject", {})} />
          </div>

          <div className="textInput">
            <label htmlFor="message">
              Your Message<sup style={{ color: "rgb(170, 57, 57)" }}>*</sup>
            </label>
            <textarea
              rows={8}
              cols={40}
              id="message"
              {...register("message", {
                required: "Send a message",
                maxLength: 300,
              })}
              aria-invalid={errors.message ? "true" : "false"}
            />
            {errors.message?.type === "required" && (
              <p role="alert" className="errorMsg">
                {errors.message?.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submitButton"
          >
            {isSubmitting && <i className="fa fa-circle-o-notch fa-spin"></i>}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
