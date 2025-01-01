import React from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Bottom from '../../layout/Footer/Bottom';

const Privacy = () => {
  const nav = useNavigate()

  return (
    <>
      <Navbar />
      <div className="flex justify-center md:flex-row flex-col bg-darkBlue p-[1rem] md:p-[2rem] gap-x-[4rem]">
        <div className="">
          <h1 className="text-3xl font-semibold text-white mb-4">
            Privacy Policy
          </h1>

          <div className="mb-4">
            <h2 className="text-[1.2rem] font-semibold text-white">
              Who we are
            </h2>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              Our website address is: &nbsp;
              <a
                href="/"
                target='blank'
                rel="noopener noreferrer"
                className="text-f3c15f gap-1"
              >
                www.totallytabletop.com
              </a>

            </p>
            <p className="text-white  mb-2 w-[100%] md:w-[80%]">
              What personal data we collect and why we collect it:
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-[1.2rem] font-semibold text-white mb-4">
              Forms
            </h2>
            <p className="text-white  mb-4 w-[100%] md:w-[80%]">
              We use contact forms so that users can get in touch with us. By
              submitting contact forms, we will process the information you
              submit in order that we can reply to your message and deal with
              your request. Forms are also used to collect information about
              organisations nominated for free first aid training courses. Any
              information supplied will be held in order to verify the details
              of the organisation, their eligibility to receive free training,
              and to verify that the individual making a nomination is
              suitably authorised to do so. They may also be used to contact
              the organisation in question and to secure their approval to be
              a part of any voting campaign.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-[1.2rem] font-semibold text-white">
              Analytics
            </h2>
            <p className="text-white  mb-4 w-[100%] md:w-[80%]">
              We make use of analytics services to evaluate and improve our
              website’s performance, and to make sure it is working properly for
              our users. We do not store any analytics or tracking cookies on
              your device without first gaining your consent.
            </p>
          </div>

          <h2 className="text-[1.2rem] font-semibold text-white mb-4">
            Cookies
          </h2>
          <p className="text-white  mb-4 w-[100%] md:w-[80%]">
            Our site uses cookies for specific purposes. You can find out all
            about how we use cookies in our{" "}
            <a
                href="/cookies"
                target='blank'
                rel="noopener noreferrer"
                className="text-f3c15f gap-1"
              >
                cookie policy.</a>
          </p>

          <h2 className="text-[1.2rem] font-semibold text-white mb-4">
            Embedded content from other websites
          </h2>
          <p className="text-white  mb-4 w-[100%] md:w-[80%]">
            This site may include embedded content (e.g. videos, images,
            articles, etc.). Embedded content from other websites behaves in
            the exact same way as if the visitor has visited the other
            website. These websites may collect data about you, use cookies,
            embed additional third-party tracking, and monitor your
            interaction with that embedded content, including tracking your
            interaction with the embedded content if you have an account and
            are logged in to that website. We bear no responsibility for the
            content of third-parties, nor how they use your data.
          </p>

          <h2 className="text-[1.2rem] font-semibold text-white mb-4">
            Who we share your data with
          </h2>
          <p className="text-white  mb-4 w-[100%] md:w-[80%]">
            We don’t share personal data with third parties. Form submissions
            may be checked through an automated spam detection service.
          </p>

          <h2 className="text-[1.2rem] font-semibold text-white mb-4">
            How long we retain your data
          </h2>
          <p className="text-white  mb-4 w-[100%] md:w-[80%]">
            The information you submit is retained only as long as is
            necessary for the purpose it is gathered (e.g. to respond to your
            enquiry), or one year, whichever is shorter.
          </p>

          <h2 className="text-[1.2rem] font-semibold text-white mb-4">
            What rights you have over your data
          </h2>
          <p className="text-white  mb-4 w-[100%] md:w-[80%]">
            If you filled in a form on this website, or have submitted details
            you can request to receive an exported file of the personal data
            we hold about you, including any data you have provided to us. You
            can also request that we erase any personal data we hold about
            you. This does not include any data we are obliged to keep for
            administrative, legal, or security purposes.
          </p>

          <h2 className="text-[1.2rem] font-semibold text-white mb-4">
            Where we send your data
          </h2>
          <p className="text-white  mb-4 w-[100%] md:w-[80%]">
            Your data may be sent to the services outlined above in order to
            help facilitate your request. By default data will be processed in
            the UK, although occasionally our cloud computing providers will
            process data in the USA. Any data transfer to the USA is based on
            the standard contractual clauses of the European Commission.
          </p>

          <h2 className="text-[1.2rem] font-semibold text-white mb-4">
            Contact information
          </h2>
          <p className="text-white mb-4 w-[100%] md:w-[80%]">
            You can {" "}
            <a
                href="/contactus"
                target='blank'
                rel="noopener noreferrer"
                className="text-f3c15f gap-1"
              >
              contact us using this website
              </a>{" "}
            if you want to query anything regarding this policy, or how it
            relates to your data.
          </p>
        </div>
      </div>

      <Bottom />
    </>
  );
}

export default Privacy
