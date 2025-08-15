<script setup lang="ts">
  import { nextTick } from "vue";
  definePageMeta({ breadcrumb: "Home", layout: "resume" });

  const contact = {
    email: "andrewbrownfamily@gmail.com",
    phone: "832-288-0014",
    location: "Houston, United States",
    links: [
      { label: "LinkedIn", to: "#", icon: "i-simple-icons-linkedin" },
      {
        label: "Email",
        to: "mailto:andrewbrownfamily@gmail.com",
        icon: "i-lucide-mail",
      },
      { label: "Phone", to: "tel:832-288-0014", icon: "i-lucide-phone" },
    ],
  };

  // Profile image loading state
  const profileImageLoaded = ref(false);

  // Check if profile image loads successfully
  onMounted(() => {
    const img = new Image();
    img.onload = () => {
      profileImageLoaded.value = true;
    };
    img.onerror = () => {
      profileImageLoaded.value = false;
    };
    img.src = "/images/ai_001_md.png";
  });

  // Image used in My Story group photo (switch between Group1 and Group2)
  const groupImage = ref("/images/RoboticsGroup2.png");

  // Vision demo visibility and anchor ref
  const showVisionDemo = ref(false);
  function toggleVisionDemo() {
    showVisionDemo.value = !showVisionDemo.value;
    if (showVisionDemo.value) {
      nextTick(() => {
        document.getElementById("vision-demo")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }

  // Signal page ready for testing
  onMounted(() => {
    console.log("Index page mounted. Ready for testing.");
    window.dispatchEvent(
      new CustomEvent("app-ready", { detail: { route: "home" } })
    );
  });
</script>

<template>
  <div class="relative">
    <!-- Profile Section with Portrait -->
    <div
      class="relative bg-gradient-to-b from-primary/2 via-primary/1 to-transparent py-20 lg:py-24"
    >
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-40 -right-40 w-80 h-80 bg-primary/2 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/2 rounded-full blur-3xl"
        ></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div
          class="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
        >
          <!-- Portrait Image -->
          <div class="flex-shrink-0">
            <div class="relative group">
              <div
                class="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-2xl transition-all duration-300 group-hover:ring-primary/40 group-hover:shadow-primary/25"
              >
                <img
                  src="/images/ai_001_md.png"
                  alt="Andrew Brown - Software Developer"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  @error="$event.target.style.display = 'none'"
                />
                <!-- Fallback placeholder if image doesn't load -->
                <div
                  v-if="!profileImageLoaded"
                  class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                >
                  <div class="text-center">
                    <div class="text-6xl text-primary/60 mb-2">
                      <i class="i-lucide-user"></i>
                    </div>
                    <div class="text-sm text-primary/80 font-medium">
                      Profile Photo
                    </div>
                  </div>
                </div>
              </div>
              <!-- Decorative ring -->
              <div
                class="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse"
              ></div>
              <!-- Hover effect overlay -->
              <div
                class="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300"
              ></div>
            </div>
          </div>

          <!-- Hero Content -->
          <div class="text-center max-w-2xl mx-auto">
            <h1
              class="text-4xl lg:text-6xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent"
            >
              Andrew Brown
            </h1>
            <p
              class="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed"
            >
              Software Developer • AI-Enthusiast • Passionate about enhancing
              our lives
            </p>
            <div class="flex flex-wrap justify-center lg:justify-start gap-3">
              <UButton
                v-for="link in contact.links"
                :key="link.label"
                :to="link.to"
                :icon="link.icon"
                variant="soft"
                color="primary"
                size="lg"
                class="transition-all duration-200 hover:scale-105"
              >
                {{ link.label }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UPageSection id="about">
      <template #title>About</template>
      <p class="prose prose-invert/neutral max-w-3xl mx-auto text-center">
        I’m Andrew Brown, a software developer and AI enthusiast studying
        Computer Science at San Jacinto College. My experience spans from
        building secure, responsive frontend web applications to integrating and
        optimizing AI models ranging from simple API calls to GPU-accelerated
        local inference, fine-tuning, along with Yolo vision and multimodal
        systems. I enjoy merging strong engineering with creative
        problem-solving, and I’m seeking opportunities to expand my skills in AI
        development and deployment.
      </p>
    </UPageSection>

    <UPageSection id="experience">
      <template #title>Experience</template>
      <UPageGrid :ui="{ base: 'grid-cols-1', md: 'grid-cols-2' }">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold"
                >Self-employed • Apprentice Developer</span
              >
              <span class="text-sm text-muted">2018 — Present</span>
            </div>
          </template>
          <ul class="list-disc ms-4 marker:text-primary">
            <li>
              Designed custom computers for productivity and gaming; sourced
              hardware, built, tested, and trained users.
            </li>
            <li>Helped design and build websites using HTML/CSS/JavaScript.</li>
            <li>
              Built custom programs in Java, C#, and Visual Basic to meet
              defined requirements.
            </li>
            <li>Developed complex Excel-based tax models to specification.</li>
          </ul>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold"
                >Deer Park ISD • Computer Technician</span
              >
              <span class="text-sm text-muted">2022 — 2023</span>
            </div>
          </template>
          <ul class="list-disc ms-4 marker:text-primary">
            <li>Kept device configurations up to date and deployment-ready.</li>
            <li>
              Diagnosed and resolved hardware/software malfunctions; replaced
              defective components.
            </li>
            <li>
              Coordinated repair and maintenance with staff ahead of scheduled
              projects.
            </li>
            <li>Validated functionality with post-repair testing.</li>
            <li>
              Used network privileges for user management and device
              configuration.
            </li>
          </ul>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold"
                >Texas Young Farmers • Web Consultant/Developer</span
              >
              <span class="text-sm text-muted">2024</span>
            </div>
          </template>
          <ul class="list-disc ms-4 marker:text-primary">
            <li>
              Designed, developed, and launched the public website
              <a
                href="https://txyoungfarmers.com"
                class="text-primary underline"
                target="_blank"
                rel="noopener"
                >Texas Young Farmers</a
              >.
            </li>
            <li>
              Implemented content structure, navigation, and responsive design.
            </li>
            <li>
              Provided ongoing consulting for updates and performance
              improvements.
            </li>
          </ul>
        </UCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection id="education">
      <template #title>Education</template>
      <UPageGrid :ui="{ base: 'grid-cols-1', md: 'grid-cols-2' }">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">Deer Park High School</span>
              <span class="text-sm text-muted">Graduated 2023</span>
            </div>
          </template>
          <p class="mb-2">
            High School Diploma (AP/advanced curriculum: Calculus I & II, CS
            Principles, AP Programming, AP English Language & Composition)
          </p>
          <ul class="list-disc ms-4 marker:text-primary">
            <li>
              Robotics Member (2017–2023), Student Council (2021–2023), Mu Alpha
              Theta (2021–2023).
            </li>
            <li>Cybersecurity coursework; CyberPatriot competitor.</li>
            <li>VEX State Robotics Winner (2021–2023).</li>
          </ul>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">San Jacinto Community College</span>
              <span class="text-sm text-muted">2023 — 2024</span>
            </div>
          </template>
          <p class="mb-2">
            Computer Science and Programming, Associate of Science (in progress)
          </p>
          <ul class="list-disc ms-4 marker:text-primary">
            <li>
              Coursework: U.S. History I & II, Film Appreciation, University
              Physics I & II, Computer Fundamentals I & II, Linear Algebra,
              Badminton, Texas Government, Psychology, Federal Government.
            </li>
          </ul>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold"
                >University of Houston (Main Campus)</span
              >
              <span class="text-sm text-muted">Future Aspirations</span>
            </div>
          </template>
          <p class="mb-2">Bachelor of Science in Computer Science (planned)</p>
          <ul class="list-disc ms-4 marker:text-primary">
            <li>
              Focus: Artificial Intelligence, Machine Learning, and AI insights
              for real-world applications.
            </li>
            <li>
              Interests: Applied LLMs, retrieval-augmented systems, and computer
              vision, Cuda, PyTorch, Localization, Fine-tuning, Multi-Modality
              system, and much more!
            </li>
          </ul>
        </UCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection id="skills">
      <template #title>Skills</template>
      <div class="space-y-6">
        <div
          v-for="skillCategory in [
            {
              name: 'Programming',
              skills: [
                'Python',
                'JavaScript',
                'TypeScript',
                'Vue',
                'Java',
                'C#',
                'HTML',
              ],
            },
            {
              name: 'AI / CV',
              skills: [
                'Computer Vision Development',
                'LLM Integration',
                'RAG (Retrieval-Augmented Generation)',
                'Localized Development',
              ],
            },
            {
              name: 'Cloud & DevOps',
              skills: [
                'Cloud Management',
                'Containers',
                'Microsoft Azure',
                'AWS',
              ],
            },
            {
              name: 'Data & Productivity',
              skills: [
                'Microsoft Excel',
                'Complex tax modeling (Excel)',
                'SSMS',
                'MSSQL',
              ],
            },
            {
              name: 'Design & 3D',
              skills: [
                'Adobe Photoshop',
                'Adobe Premiere',
                'Web Design',
                '3D Models',
                'CAD',
              ],
            },
            { name: 'Robotics', skills: ['Robotics Design and Production'] },
          ]"
          :key="skillCategory.name"
        >
          <h3 class="text-lg font-semibold mb-2">{{ skillCategory.name }}</h3>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="skill in skillCategory.skills"
              :key="skill"
              color="primary"
              variant="soft"
            >
              {{ skill }}
            </UBadge>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection id="my-story">
      <template #title>My Story</template>
      <div
        class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 items-start lg:items-center"
      >
        <!-- Left image -->
        <div class="hidden lg:flex justify-end self-center lg:col-span-1">
          <div
            class="w-72 h-96 xl:w-80 xl:h-[28rem] rounded-2xl overflow-hidden bg-default/5 flex items-center justify-center"
          >
            <img
              src="/images/MeRobotics.png"
              alt="Andrew working on robotics"
              class="w-full h-full object-contain"
            />
          </div>
        </div>

        <!-- Story content -->
        <div
          class="prose prose-invert/neutral max-w-4xl lg:max-w-none mx-auto space-y-6 leading-relaxed lg:col-span-2"
        >
          <p>
            I used to think DDR3 RAM was as fast as computers would ever get.
            I’d slot it in, watch pixels crawl down the screen, and think, “Yep,
            this is the future.” My dad used to describe how the GPU would
            render pixels top-down back then and how I should be grateful for
            how far technology has come. Now, with the same componet, the GPU, I
            can run large language models that generate paragraphs of knowledge
            in the time it used to take a loading bar to move an inch.
          </p>
          <p>
            My acumen for networking, server hosting, and operating systems was
            fueled by gaming at a young age. I wanted my friends and me to share
            the same worlds, so I learned to host localized Docker Minecraft and
            other game servers. I didn’t set out to master networking or server
            hosting it became a skill I picked up in the pursuit of better
            gameplay and team adventures. Those early nights configuring ports
            and containers were my first real lessons in infrastructure.
          </p>
          <p>
            Then came robotics. Since 3rd grade I’ve been in robotics, always
            hungry to build more efficiently and effectively. Over the years, I
            learned that real success is built on integration, experience, and
            team discussion. Collaboration, persistence, and the belief that no
            problem is too complex are what drive me forward.
          </p>
          <p>
            When ChatGPT arrived, my learning went into overdrive. My first
            project was a simple API call. From there, I dove into creating
            custom mouse drivers and integrating real-time vision models like
            YOLO. I built localized servers, fine-tuned AI models, explored
            multi-modality, and deployed systems to the cloud. I worked with
            CI/CD GitHub Actions, ran large models locally, built frontends from
            scratch, integrated MSSQL with SSMS, and delivered end-to-end
            AI-powered apps.
          </p>
          <p>
            Today, I’m not just fascinated by technology I’m committed to
            mastering our next frontier. Whether it’s robotics, AI model
            deployment, or full-stack development, I approach every project with
            the same curiosity I had as a kid building game servers — always
            looking for the next way to turn an idea into reality.
          </p>
        </div>

        <!-- Right image -->
        <div class="hidden lg:flex justify-start self-center lg:col-span-1">
          <div
            class="w-72 h-96 xl:w-80 xl:h-[28rem] rounded-2xl overflow-hidden bg-default/5 flex items-center justify-center"
          >
            <img
              src="/images/MeChilling.png"
              alt="Andrew relaxing"
              class="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <!-- Group image below content -->
      <div class="mt-8 flex justify-center">
        <div class="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl">
          <img
            :src="groupImage"
            alt="Robotics team group photo"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </UPageSection>

    <UPageSection id="projects">
      <template #title>Projects</template>
      <UPageGrid :ui="{ base: 'grid-cols-1', md: 'grid-cols-2' }">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">Texas Young Farmers Website</span>
              <UBadge color="primary" variant="soft">2024</UBadge>
            </div>
          </template>
          <p class="mb-4">
            Designed and developed the public website for the State Association
            of Young Farmers of Texas with responsive UI and clear content
            structure.
          </p>
          <div class="flex gap-2">
            <UButton
              label="Visit Site"
              to="https://txyoungfarmers.com"
              target="_blank"
              rel="noopener"
              icon="i-lucide-external-link"
              color="primary"
            />
          </div>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">Vision AI Lab</span>
              <UBadge color="primary" variant="soft">Long Term</UBadge>
            </div>
          </template>
          <p class="mb-4">
            A lab environment for experimenting with real-time computer vision,
            fine-tuning, and multimodal AI workflows.
          </p>
          <div class="flex gap-2">
            <UButton
              :label="showVisionDemo ? 'Hide Demo' : 'View Project'"
              icon="i-lucide-external-link"
              :color="showVisionDemo ? 'neutral' : 'primary'"
              :variant="showVisionDemo ? 'soft' : 'solid'"
              @click="toggleVisionDemo()"
            />
          </div>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">Job Assistant LLM</span>
              <UBadge color="primary" variant="soft">Long Term</UBadge>
            </div>
          </template>
          <p class="mb-4">
            A personal assistant focused on job search and application support
            powered by LLMs and retrieval-augmented workflows.
          </p>
          <div class="flex gap-2">
            <UButton
              label="View Project"
              to="#vision-demo"
              icon="i-lucide-external-link"
              color="neutral"
              variant="soft"
            />
          </div>
        </UCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection id="vision-demo">
      <template #title>
        <span v-if="showVisionDemo">Interactive Vision Demo (YOLO)</span>
      </template>
      <transition name="fade" mode="out-in">
        <div v-if="showVisionDemo">
          <YOLOCard />
        </div>
      </transition>
    </UPageSection>

    <UPageSection id="contact">
      <template #title>Contact</template>
      <div class="space-y-4">
        <div class="text-sm text-muted">{{ contact.location }}</div>
        <div class="flex flex-wrap gap-2">
          <UButton
            :label="contact.email"
            :to="`mailto:${contact.email}`"
            icon="i-lucide-mail"
          />
          <UButton
            :label="contact.phone"
            :to="`tel:${contact.phone}`"
            icon="i-lucide-phone"
          />
        </div>
      </div>
    </UPageSection>
  </div>
</template>
