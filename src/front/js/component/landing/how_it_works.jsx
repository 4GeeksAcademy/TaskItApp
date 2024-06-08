import React from "react";
import "../../../styles/home.css"

const HowItWorks = () => {
    return (
        <div className="container-fluid mt-6">
            <div className="row">
                <div className="mx-auto col-10">
                    <h1>How it works</h1>
                    <h3>1. Sign Up and Create Your Profile</h3>
                    <p className="fs-4 text-muted">
                        <b className="text-orange">Joining Task It App is quick and easy</b>. Simply sign up with your email and a username. 
                        Once registered, create your profile to let others know who you are and what you're looking for. 
                        Add a photo, write a bio, and specify your role as a task seeker, requester, or both.
                    </p>
                    <div className="row d-flex mb-2">
                        <div className="col-10 col-lg-6  flex-grow-1">
                            <div className="card h-100">
                                <div className="p-0 m-0 feature-img overflow-hidden d-flex align-items-center">
                                    <img className="img-fluid w-100" src="https://cdn.discordapp.com/attachments/1248999894903947366/1249005808256286741/blondy0429_modern_flat_vector_illustration_of_an_elder_getting__ed14b236-c36b-4fe7-8657-d7c918c203bc.png?ex=6665bace&is=6664694e&hm=4329df8bcdcf58be3b3cbacf8af8e1f4e125449b4ffec7fc829570e5b1160ae0&"></img>
                                </div>
                                <div className="p-3 h-100">
                                    <h2>For Requesters</h2>
                                    <h3>2. Post Your Task</h3>
                                    <p className="fs-4 text-muted">
                                        Describe the task you need help with, select a category from our diverse range and set a deadline.
                                    </p>
                                    <h3>3. Communicate Securely</h3>
                                    <p className="fs-4 text-muted">
                                        Use our in-app messaging system to discuss task details, negotiate terms, and coordinate with your chosen helper.
                                    </p>
                                    <h3>4. Review Applicants</h3>
                                    <p className="fs-4 text-muted">
                                        Receive applications from task seekers interested in helping you. Review their profiles, ratings and price to choose the right person for you.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-10 col-lg-6 flex-grow-1">
                            <div className="card h-100">
                                <div className="p-0 m-0 feature-img overflow-hidden d-flex align-items-center">
                                    <img className="img-fluid w-100" src="https://cdn.discordapp.com/attachments/1248999894903947366/1249051864369201214/seeker.png?ex=6665e5b2&is=66649432&hm=badd32b3eefe7bc51653f283f000cb4775b9a7ed746c940379621d26a756dc5c&"></img>
                                </div>
                                <div className="p-3 h-100">
                                    <h2>For Task Seekers</h2>
                                    <h3>2. Browse Available Tasks</h3>
                                    <p className="fs-4 text-muted">
                                        Explore tasks posted by requesters in various categories.
                                    </p>
                                    <h3>3. Apply for Tasks</h3>
                                    <p className="fs-4 text-muted">
                                        Find a task that interests you? Apply for it with the price you would do it for.
                                    </p>
                                    <h3>4. Stay Connected</h3>
                                    <p className="fs-4 text-muted">
                                        Receive notifications and messages from requesters regarding your applications. Once selected, communicate securely with the requester to clarify any questions and get started on the task.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3>5. Rate and Review</h3>
                    <p className="fs-4 text-muted">After task completion, both solicitors and task seekers have the opportunity to rate and review each other.</p>
                    <p className="fs-4 text-muted">Build a trusted reputation within the community based on your reliability, professionalism and quality of work.</p>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks;