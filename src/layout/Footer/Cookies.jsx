import React from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Bottom from '../../layout/Footer/Bottom';

const Cookies = () => {
  const nav = useNavigate()

  return (
    <>
      <Navbar />
      <div className="flex justify-center md:flex-row flex-col bg-darkBlue p-[1rem] md:p-[2rem] gap-x-[4rem]">
        <div className="">
          <h1 className="text-3xl font-semibold text-white mb-4">
            Cookie Policy
          </h1>

          <div className="mb-4">
            <h2 className="text-[1.2rem] font-semibold text-white mb-4">
              About this cookie policy
            </h2>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              This Cookie Policy explains what cookies are and how they are
              used. You should read this policy to understand what cookies
              are, how they are used on this site, the types of cookies used
              i.e, the information collected using cookies and how that
              information is used and how to control the cookie preferences.{" "}
            </p>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              For further information on how data is used, stored and kept
              secure, see the Privacy Policy. You can at any time change or
              withdraw your consent from the Cookie Declaration on this
              website, or the ‘Manage your consent’ link below.
            </p>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              Your consent applies to the following domains:&nbsp;

              <a
                href="/"
                target='blank'
                rel="noopener noreferrer"
                className="text-f3c15f gap-1"
              >
                www.totallytabletop.com
              </a> &nbsp;

              Your current state: Consent accepted.
            </p>
          </div>

          <div className="mb-4">
            <h1 className="text-[1.2rem] font-semibold text-white mb-4">
              What are cookies?
            </h1>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              Cookies are small text files that are used to store small pieces
              of information. Some cookies may be stored on your device when
              the website is loaded on your browser, others require your
              consent. These cookies help make this website function properly,
              make the website more secure, provide better user experience,
              and understand how the website performs and to analyze what
              works and where it needs improvement.
            </p>
          </div>

          <div className="mb-4">
            <h1 className="text-[1.2rem] font-semibold text-white mb-4">
              How do we use cookies?
            </h1>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              As with most online services, this website uses cookies
              first-party and third-party cookies for a number of purposes.
              The first-party cookies are mostly necessary for the website to
              function the right way, and they do not collect any of your
              personally identifiable data. The third-party cookies used on
              this website are used mainly for understanding how the website
              performs, how you interact with the website, keeping services
              secure, and all in all providing you with a better and improved
              user experience and help speed up your future interactions with
              the website.
            </p>
          </div>

          <div className="mb-4">
            <h1 className="text-[1.2rem] font-semibold text-white mb-4">
              What types of cookies do we use?
            </h1>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              We may use or seek to gain consent to use the following types of
              cookies on this website:{" "}
            </p>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              {" "}
              <b>Essential: </b>Some cookies are essential for you to be able
              to experience the full functionality of our site. They allow us
              to maintain user sessions and prevent any security threats. They
              do not collect or store any personal information. For example,
              these cookies allow you to log-in to your account and add
              products to your basket, and checkout securely.{" "}
            </p>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              {" "}
              <b>Statistics:</b> These cookies store information like the
              number of visitors to the website, the number of unique
              visitors, which pages of the website have been visited, the
              source of the visit, etc. These data help us understand and
              analyze how well the website performs and where it needs
              improvement.{" "}
            </p>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              {" "}
              <b>Marketing:</b> Our website displays advertisements. These
              cookies are used to personalize the advertisements that we show
              to you so that they are meaningful to you. These cookies also
              help us keep track of the efficiency of these ad campaigns.The
              information stored in these cookies may also be used by
              third-party ad providers to show you ads on other websites on
              the browser as well.
            </p>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              {" "}
              <b>Functional:</b> These are the cookies that help certain
              non-essential functionalities on our website. These
              functionalities include embedding content like videos or sharing
              content of the website on social media platforms.{" "}
            </p>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              {" "}
              <b>Preferences:</b> These cookies help us store your settings
              and browsing preferences like language preferences so that you
              have a better and more efficient experience on future visits to
              the website.
            </p>
          </div>

          <div className="mb-4">
            <h1 className="text-[1.2rem] font-semibold text-white mb-4">
              How can I control my cookie preferences?
            </h1>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              Should you decide to change your preferences later through your
              browsing session, you can click on the “Manage your consent”
              link near the top of this page. This will display the consent
              notice again enabling you to change your preferences or withdraw
              your consent entirely. In addition to this, different browsers
              provide different methods to block and delete cookies used by
              websites. You can change the settings of your browser to
              block/delete the cookies. To find out more on how to manage and
              delete cookies, visit wikipedia.org,&nbsp;
              <a
                href="https://allaboutcookies.org/"
                target='blank'
                rel="noopener noreferrer"
                className="text-f3c15f gap-1"
              >www.allaboutcookies.org.
              </a>
            </p>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              You can also contact us{" "}
              <a
                href="/contactus"
                target='blank'
                rel="noopener noreferrer"
                className="text-f3c15f gap-1"
              >
                through the contact us form available on our Site.
              </a>{" "}
            </p>
          </div>
        </div>
      </div>

      <Bottom />
    </>
  );
}

export default Cookies
