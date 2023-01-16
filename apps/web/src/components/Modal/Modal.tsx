import Image from "next/image";

const Modal = ({handleClick}) => {

  return (
    <>
      <div className="fixed h-screen w-screen bg-neutral-900/50 flex justify-center items-center overflow-y-auto z-10 inset-0">
        <div className="flex flex-col border-2 rounded-lg w-1/2 bg-white p-6 relative">
          <div className="absolute right-0 mr-6" onClick={handleClick}>
            <Image
              width="22"
              height="22"
              className="rounded-full"
              src="/close.svg"
              alt=""
            />
          </div>
          <div className="mx-auto text-[48px] font-medium text-[#08010D] my-2">
            Connect with Discord bot
          </div>
          <div className="mx-6 my-3">
            <ol className="list-decimal break-words">
              <li>Go to devnode server.</li>
              <li>In &quot;devnode_signin&quot; channel type &quot;devnode&quot;.</li>
              <li>Check your DM. You will be asked to reply with your did. It should look similar to this example: &quot;did:key:z6MkkyAkqY9bPr8gyQGuJTwQvzk8nsfywHCH4jyM1CgTq4KA&quot;. You can copy the DID by clicking on the created DID.</li>
              <li>You will get a challenge code. Copy that URL and paste it in your browser.</li>
              <li>Once you get the success message, you are good to go. Head back to the application and start exploring.</li>
            </ol>
          </div>
          <a href="https://discord.com/channels/959133142348886016/1043095213238915093" target="_blank" rel="noreferrer" className="flex justify- items-center w-1/3 mx-auto bg-[#5A68F1] text-white p-3 border-2 rounded-lg">
            <div className="w-5 h-5 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
              </svg>
            </div>
            <div className="w-full">
              Go to Devnode Server
            </div>
          </a>
        </div>
      </div>   
    </>
  );
};

export default Modal;
