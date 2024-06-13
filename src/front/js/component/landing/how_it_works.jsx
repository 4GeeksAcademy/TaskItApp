import React from "react";
import "../../../styles/home.css"
import seeker from "../../../img/seeker.webp"
import requester from "../../../img/requester.webp"

const HowItWorks = () => {
    return (
        <div className="container-fluid mt-6" id="how-it-works">
            <div className="row">
                <div className="mx-auto col-10">
                    <h1>How it works</h1>
                    <h3>1. Sign Up and Create Your Profile <small>📝</small></h3>
                    <p className="fs-4 text-muted">
                        <b className="text-orange">Joining Task It App is quick and easy</b>. Simply sign up with your email and a username. 
                        Once registered, create your profile to let others know who you are and what you're looking for. 
                        Add a photo, write a bio, and specify your role as a task seeker, requester, or both.
                    </p>
                    <div className="row d-flex my-2 g-5">
                        <div className="col-10 col-lg-6 flex-grow-1">
                            <div className="card h-100">
                                <div className="p-0 m-0 feature-img overflow-hidden d-flex align-items-center">
                                    <img className="img-fluid w-100" src={requester}></img>
                                </div>
                                <div className="p-3 h-100">
                                    <h2 className="text-green">For Requesters</h2>
                                    <h3>2. Post Your Task <small>📌</small></h3>
                                    <p className="fs-4 text-muted">
                                        Describe the task you need help with, select a category from our diverse range and set a deadline.
                                    </p>
                                    <h3>3. Communicate Securely <small>💬</small></h3>
                                    <p className="fs-4 text-muted">
                                        Use our in-app messaging system to discuss task details, negotiate terms, and coordinate with your chosen helper.
                                    </p>
                                    <h3>4. Review Applicants  <small>👥</small></h3>
                                    <p className="fs-4 text-muted">
                                        Receive applications from task seekers interested in helping you. Review their profiles, ratings and price to choose the right person for you.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-10 col-lg-6 flex-grow-1">
                            <div className="card h-100">
                                <div className="p-0 m-0 feature-img overflow-hidden d-flex align-items-center">
                                    <img className="img-fluid w-100" src={seeker}></img>
                                </div>
                                <div className="p-3 h-100">
                                    <h2 className="text-yellow">For Task Seekers</h2>
                                    <h3>2. Browse Available Tasks <small>🔍</small></h3>
                                    <p className="fs-4 text-muted">
                                        Explore tasks posted by requesters in various categories.
                                    </p>
                                    <h3>3. Apply for Tasks <small>✅</small></h3>
                                    <p className="fs-4 text-muted">
                                        Find a task that interests you? Apply for it with the price you would do it for.
                                    </p>
                                    <h3>4. Stay Connected <small>📲</small></h3>
                                    <p className="fs-4 text-muted">
                                        Receive notifications and messages from requesters regarding your applications. Once selected, communicate securely with the requester to clarify any questions and get started on the task.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <h3>5. Rate and Review <small>⭐</small></h3>
                        <p className="fs-4 text-muted">After task completion, both requesters and task seekers have the opportunity to rate and review each other.</p>
                    </div>
                    <h4 className="text-orange">Build a trusted reputation within the community based on your reliability, professionalism and quality of work.</h4>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks;