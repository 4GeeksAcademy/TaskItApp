import React from "react";
import "../../../styles/home.css"
import Feature from "./feature.jsx";
import registration from "../../../img/registration.png"
import posting from "../../../img/posting.png"
import review from "../../../img/review.png"
import diverse from "../../../img/diverse.png"
import messaging from "../../../img/messaging.png"
import security from "../../../img/security.png"

const Features = () => {
    return (
        <div className="container-fluid mt-6">
            <div className="row">
                <div className="mx-auto col-10">
                    <h1>Features</h1>
                    <div className="row d-flex justify-content-between g-5">
                        <Feature 
                            src={registration}
                            feature={"Easy Registration and Profile Creation"}
                            description={"Joining is a breeze. Sign up with your email and create a personalized profile in seconds!"}
                        />
                        <Feature 
                            src={posting}
                            feature={"Effortless Task Posting and Search"}
                            description={
                                <>
                                    Whether you need help or want to lend a hand, posting and finding tasks is simple. 
                                    <b className="text-orange"> Requesters</b> can quickly post tasks, while <b className="text-orange">seekers</b> can easily browse and apply for the tasks that match their preferences.
                                </>
                            }
                        />
                        <Feature 
                            src={review}
                            feature={"Build Trust with Ratings and Reviews"}
                            description={"Trust is essential in our community. Both Solicitors and task seekers can rate and review each other after task completion, ensuring transparency and accountability every step of the way."}
                        />
                        <Feature 
                            src={diverse}
                            feature={"Diverse Task Categories"}
                            description={"From grocery shopping to home maintenance. Task It App offers a diverse range of task categories to cater to all your needs."}
                        />
                        <Feature 
                            src={messaging}
                            feature={"Secure Messaging System"}
                            description={"Communicate with confidence using our in-app messaging system. Discuss task details, negotiate terms, and clarify requirements within the platform."}
                        />
                        <Feature 
                            src={security}
                            feature={"Privacy and Security"}
                            description={"Your privacy and security are our top priorities. Rest assured that your data is encrypted and protected."}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Features;