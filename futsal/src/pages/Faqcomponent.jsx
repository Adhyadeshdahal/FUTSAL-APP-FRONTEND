import { Container, Row, Col, Accordion } from "react-bootstrap";

const faq = [
    {
        id: 1,
        eventKey: 0,
        title: "What services does our website offer?",
        desc: "Our website provides a comprehensive suite of tools designed to streamline your workflow, including scheduling, project management, and collaboration features.",
    },
    {
        id: 2,
        eventKey: 1,
        title: "How do I sign up for an account?",
        desc: "Signing up is easy! Just click the ‘Sign Up’ button on our homepage and follow the instructions to create your account.",
    },
    {
        id: 3,
        eventKey: 2,
        title: "What kind of support can I expect? ",
        desc: "We offer 24/7 customer support through live chat, email, and phone to ensure you always have help when you need it.",
    },
    {
        id: 4,
        eventKey: 3,
        title: "Is my data secure?",
        desc: "Security is our top priority. We use state-of-the-art encryption and security practices to protect your data.",
    },
    {
        id: 5,
        eventKey: 4,
        title: "How do I cancel my subscription?",
        desc: "You can cancel your subscription at any time through your account settings, with no hidden fees or penalties.",
    },
    {
        id: 6,
        eventKey: 5,
        title: "Apakah ada Mentornya?",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id estlaborum.",
    },
    {
        id: 7,
        eventKey: 6,
        title: "How do I reset my password?",
        desc: "If you’ve forgotten your password, simply click on ‘Forgot Password?’ at the login page and follow the instructions to reset it.",
    },
    {
        id: 8,
        eventKey: 7,
        title: "How can I contact customer support?",
        desc: "Our customer support team is available via live chat, email, or phone. Visit our ‘Contact Us’ page for more details.",
    },
];

const Faqcomponent = () => {
  return (
    <div className="faq">
      <Container>
        <Row>
          <Col>
          <h2 className="text-center fw-bold animate__animated animate__fadeInUp animate__delay-1s"> Frequently Raised Queries </h2>
          
          </Col>
        </Row>
        <Row className=" rows-cols-lg-2 row-cols-1 g-4 pt-5">
          {faq.map((data) => {
            return(

              <Col key={data.id}>
          {/* <Accordion defaultActiveKey="0"> */}
                  <Accordion className="shadow-sm">
                    <Accordion.Item eventKey={data.eventKey}>
                      <Accordion.Header>{data.title}</Accordion.Header>
                      <Accordion.Body>
                        {data.desc}
                      </Accordion.Body>
                    </Accordion.Item>     
                  </Accordion>

          </Col>
            )


            

          })}

          
        

        </Row>
      </Container>
         


    </div>
  )
}

export default Faqcomponent