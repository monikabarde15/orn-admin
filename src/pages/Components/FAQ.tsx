import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section className="max-w-5xl mx-auto py-24 px-6 text-white">
      <div className="text-center mb-14">
        <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400 mt-4 text-lg">
          Everything you need to know before getting started.
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="space-y-4"
      >
        {/* Item 1 */}
        <AccordionItem
          value="item-1"
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
        >
          <AccordionTrigger className="px-6 py-4 text-left hover:text-purple-300">
            Do I need to install anything on my computer?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            No. All labs run online. You can access them directly through your
            browser without installing any software.
          </AccordionContent>
        </AccordionItem>

        {/* Item 2 */}
        <AccordionItem
          value="item-2"
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
        >
          <AccordionTrigger className="px-6 py-4 text-left hover:text-purple-300">
            What are the prerequisites to start using the labs?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            Basic Linux knowledge is helpful, but not mandatory. Each lab is
            designed to be beginner-friendly for all skill levels.
          </AccordionContent>
        </AccordionItem>

        {/* Item 3 */}
        <AccordionItem
          value="item-3"
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
        >
          <AccordionTrigger className="px-6 py-4 text-left hover:text-purple-300">
            Are these labs suitable for RHCE, RHCSA, or DevOps preparation?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            Yes. Our Linux, Docker, Kubernetes, and Red Hat Cluster labs help
            prepare for RHCSA, RHCE, and DevOps-based roles.
          </AccordionContent>
        </AccordionItem>

        {/* Item 4 */}
        <AccordionItem
          value="item-4"
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
        >
          <AccordionTrigger className="px-6 py-4 text-left hover:text-purple-300">
            What if I get stuck or face an issue during the lab?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            You can contact our support team anytime. We assist with
            troubleshooting and provide guidance throughout your practice.
          </AccordionContent>
        </AccordionItem>

        {/* Item 5 */}
        <AccordionItem
          value="item-5"
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
        >
          <AccordionTrigger className="px-6 py-4 text-left hover:text-purple-300">
            Do I need my own hardware server or virtual machines?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            No. We provide fully configured multi-node servers, clusters,
            Docker, and Kubernetes environments online.
          </AccordionContent>
        </AccordionItem>

        {/* Item 6 */}
        <AccordionItem
          value="item-6"
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
        >
          <AccordionTrigger className="px-6 py-4 text-left hover:text-purple-300">
            Can I access the labs from mobile or tablet devices?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            Yes, you can access all labs from laptops, desktops, tablets, and
            mobile devices with a stable internet connection.
          </AccordionContent>
        </AccordionItem>

        {/* Item 7 */}
        <AccordionItem
          value="item-7"
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
        >
          <AccordionTrigger className="px-6 py-4 text-left hover:text-purple-300">
            How long can I access the lab after purchase?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            Access duration depends on your plan. Each plan mentions the
            included hours or days clearly.
          </AccordionContent>
        </AccordionItem>

        {/* Item 8 */}
        <AccordionItem
          value="item-8"
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
        >
          <AccordionTrigger className="px-6 py-4 text-left hover:text-purple-300">
            Can beginners use these labs?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-300">
            Absolutely. These labs are designed for both beginners and
            professionals who want hands-on real-world practice.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}