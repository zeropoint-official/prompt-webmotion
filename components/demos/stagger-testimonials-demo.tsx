import StaggerTestimonials from "@/components/StaggerTestimonials";

export default function StaggerTestimonialsDemo() {
  return (
    <section className="w-full bg-[#2a241f] py-20">
      <h2 className="mb-8 text-center text-3xl font-medium text-[#f6f3ec]">
        Loved by our clients
      </h2>
      <StaggerTestimonials
        items={[
          {
            tempId: 0,
            testimonial:
              "Stylish setup, amazing photo quality, and super friendly staff.",
            by: "Natasha",
          },
          {
            tempId: 1,
            testimonial:
              "One of the best decisions we made for our wedding!",
            by: "Alexia",
          },
          {
            tempId: 2,
            testimonial:
              "Beautifully organised with so many options — the best I've seen.",
            by: "Socrates",
          },
          {
            tempId: 3,
            testimonial:
              "From booking to the big day, everything was effortless and polished.",
            by: "Mariam",
          },
          {
            tempId: 4,
            testimonial:
              "Our guests are still talking about it. Worth every penny.",
            by: "Daniel",
          },
        ]}
      />
    </section>
  );
}
