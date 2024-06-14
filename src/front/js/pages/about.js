import React from 'react';

const About = () => {
    return (
        <div className="container mt-6 mb-5">
            <div className="row">
                <div className="col-12 col-md-7 order-1">
                    <h1 className="display-1 fw-bold">About</h1>
                    
                    <p className="fs-4 text-muted">
                        At Task It App, we're passionate about simplifying everyday tasks and fostering community connections. Founded by a team of three dedicated individuals, all students
                        of a rigorous full-stack development bootcamp, we strive to create a platform that empowers users to get things done efficiently and reliably.
                    </p>

                    <h2 className="text-secondary mt-5">Meet Our Team</h2>

                    <h3 className="text-secondary mt-2">Blondy</h3>

                    <p className="fs-4 text-muted">
                        With a background in video game development and a deep understanding of programming and computer science, she brings a unique perspective to our team.
                    </p>

                    <h3 className="text-secondary mt-2">Ares</h3>

                    <p className="fs-4 text-muted">
                        A versatile full-stack developer with a knack for backend architecture. His attention to detail and problem-solving skills ensure the platform runs smoothly and efficiently.
                    </p>

                    <h3 className="text-secondary mt-2">Fali</h3>

                    <p className="fs-4 text-muted">
                    I am a programming student focused on Full Stack development. Before diving into programming, I worked in electronics for several years. I am passionate about creation, and programming is another way for me to create things.
                    I am always looking to learn new technologies and improve my skills.
                    </p>
                </div>
                
                <div className="col-12 col-md-5 order-2">
                    <div className="card h-100">
                        <img src="https://res.cloudinary.com/doojwu2m7/image/upload/v1718042879/gw9flftqwp2umkbbmsue.png" className="card-img-top img-fluid" alt="Team" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
