import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserRepository } from './modules/users/application/ports/user.repository';
import { VideosRepository } from './modules/videos/application/ports/videos.repository';
import { ChannelRepository } from './modules/channels/application/ports/channel.repository';
import { PasswordHashingService } from './modules/shared/application/ports/password-hashing.interface';
import { UserFactory } from './modules/users/domain/factories/user.factory';
import { VideoFactory } from './modules/videos/domain/factories/video.factory';
import { ChannelFactory } from './modules/channels/domain/factories/channel.factory';
import { UserId } from './modules/users/domain/vo/user-id.vo';
import { User } from './modules/users/domain/user.entity';
import { Channel } from './modules/channels/domain/channel.entity';
import { ChannelId } from './modules/channels/domain/vo/channel-id.vo';

const PASSWORD = '123123123';
const AVATAR_URL =
  'http://localhost:9000/opentube/avatars/9112edb2-2198-42c3-8142-0d63ee0fbd76.jpg';
const VIDEO_URL =
  'http://localhost:9000/opentube/videos/5db245f8-51d0-4121-9254-21b4790a3081.mp4';
const THUMBNAIL_URLS = [
  'http://localhost:9000/opentube/thumbnails/474cf82c-f69b-4a1a-ac5a-440a7b05577c.png',
  'http://localhost:9000/opentube/thumbnails/ffe44d5b-2ced-4c5c-b6a7-a97aed815f7e.jpg',
];

const USERS = [
  { username: 'alice_dev', email: 'alice@example.com' },
  { username: 'bob_coder', email: 'bob@example.com' },
  { username: 'charlie_tech', email: 'charlie@example.com' },
  { username: 'diana_creator', email: 'diana@example.com' },
  { username: 'eve_streamer', email: 'eve@example.com' },
  { username: 'frank_vlogger', email: 'frank@example.com' },
  { username: 'grace_artist', email: 'grace@example.com' },
  { username: 'henry_maker', email: 'henry@example.com' },
  { username: 'ivy_designer', email: 'ivy@example.com' },
  { username: 'jack_producer', email: 'jack@example.com' },
  { username: 'kate_editor', email: 'kate@example.com' },
  { username: 'leo_director', email: 'leo@example.com' },
  { username: 'mia_content', email: 'mia@example.com' },
  { username: 'noah_creator', email: 'noah@example.com' },
  { username: 'olivia_video', email: 'olivia@example.com' },
];

const VIDEO_TITLES = [
  'Introduction to TypeScript',
  'Building REST APIs with NestJS',
  'React Hooks Explained',
  'Docker Basics for Developers',
  'Understanding GraphQL',
  'Microservices Architecture',
  'Database Design Principles',
  'CI/CD Pipeline Setup',
  'Testing Strategies',
  'Cloud Deployment Guide',
  'JavaScript Best Practices',
  'Node.js Performance Tips',
  'Security Best Practices',
  'Code Review Techniques',
  'Agile Development Workflow',
  'Git Advanced Techniques',
  'API Design Patterns',
  'Frontend Architecture',
  'Backend Optimization',
  'Full Stack Development',
  'Web Development Tutorial',
  'Mobile App Development',
  'DevOps Fundamentals',
  'System Design Basics',
  'Programming Fundamentals',
];

const VIDEO_DESCRIPTIONS = [
  'Learn the fundamentals and advanced concepts in this comprehensive tutorial.',
  'A deep dive into modern development practices and techniques.',
  'Explore best practices and real-world examples.',
  'Step-by-step guide for beginners and intermediate developers.',
  'Master the concepts with hands-on examples and exercises.',
  'Discover tips and tricks from industry experts.',
  'Complete walkthrough with code examples and explanations.',
  'Learn how to build scalable and maintainable applications.',
  'Understanding the core principles and implementation details.',
  'Practical guide with real-world scenarios and solutions.',
];

const CHANNEL_DATA = [
  {
    name: 'Alice Dev Channel',
    description: 'Programming tutorials and coding tips from Alice.',
  },
  {
    name: 'Bob Codes',
    description: 'Software development content and tech reviews.',
  },
  {
    name: 'Charlie Tech Hub',
    description: 'Technology insights and developer resources.',
  },
  {
    name: 'Diana Creates',
    description: 'Creative coding and web development tutorials.',
  },
  {
    name: 'Eve Stream Central',
    description: 'Live coding sessions and programming challenges.',
  },
  {
    name: 'Frank Vlogs Tech',
    description: 'Daily tech vlogs and coding adventures.',
  },
  { name: 'Grace Art & Code', description: 'Where art meets programming.' },
  {
    name: 'Henry Maker Space',
    description: 'DIY projects and maker tutorials.',
  },
  {
    name: 'Ivy Design Studio',
    description: 'UI/UX design and frontend development.',
  },
  {
    name: 'Jack Production House',
    description: 'Professional video production and editing tips.',
  },
  {
    name: 'Kate Editor Pro',
    description: 'Video editing tutorials and creative workflows.',
  },
  {
    name: 'Leo Director Cut',
    description: 'Filmmaking and storytelling through code.',
  },
  {
    name: 'Mia Content Lab',
    description: 'Content creation strategies and digital marketing.',
  },
  {
    name: 'Noah Creator Hub',
    description: 'Building digital products and online businesses.',
  },
  {
    name: 'Olivia Video Academy',
    description: 'Video production and streaming tutorials.',
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get<UserRepository>(UserRepository);
  const videoRepository = app.get<VideosRepository>(VideosRepository);
  const channelRepository = app.get<ChannelRepository>(ChannelRepository);
  const passwordHashingService = app.get<PasswordHashingService>(
    PasswordHashingService,
  );
  const userFactory = new UserFactory();
  const videoFactory = new VideoFactory();
  const channelFactory = new ChannelFactory();

  console.log('Starting seed...');

  // Hash password once
  const hashedPassword = await passwordHashingService.hash(PASSWORD);

  // Create users
  console.log('Creating users...');
  const createdUsers: User[] = [];
  for (const userData of USERS) {
    try {
      const user = userFactory.create(
        userData.email,
        userData.username,
        hashedPassword,
      );
      // Set avatar URL
      user.changeAvatar(AVATAR_URL);
      const savedUser = await userRepository.save(user);
      createdUsers.push(savedUser);
      console.log(`Created user: ${savedUser.username.value}`);
    } catch (error) {
      console.error(
        `Error creating user ${userData.username}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  console.log(`Created ${createdUsers.length} users`);

  // Create channels (one per user)
  console.log('Creating channels...');
  const userToChannel = new Map<string, Channel>();
  for (let i = 0; i < createdUsers.length; i++) {
    try {
      const user = createdUsers[i];
      const channelData = CHANNEL_DATA[i % CHANNEL_DATA.length];
      const ownerId = UserId.create(user.id.value);

      const channel = channelFactory.create({
        ownerId,
        name: channelData.name,
        description: channelData.description,
      });

      // Set avatar URL for the channel
      channel.updateAvatar(AVATAR_URL);

      const savedChannel = await channelRepository.save(channel);
      userToChannel.set(user.id.value, savedChannel);
      console.log(
        `Created channel: "${savedChannel.name}" for ${user.username.value}`,
      );
    } catch (error) {
      console.error(
        `Error creating channel for user ${createdUsers[i].username.value}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  console.log(`Created ${userToChannel.size} channels`);

  // Create videos (20-25 videos distributed among users with channels)
  console.log('Creating videos...');
  const videoCount = 23; // Between 20-25
  const usersWithChannels = createdUsers.filter((user) =>
    userToChannel.has(user.id.value),
  );
  const usersWithVideos = usersWithChannels.slice(0, 10); // First 10 users with channels

  if (usersWithVideos.length === 0) {
    console.error('No users with channels available to create videos');
    await app.close();
    return;
  }

  for (let i = 0; i < videoCount; i++) {
    try {
      const ownerIndex = i % usersWithVideos.length;
      const owner = usersWithVideos[ownerIndex];
      const channel = userToChannel.get(owner.id.value);

      if (!channel) {
        console.error(`No channel found for user ${owner.username.value}`);
        continue;
      }

      const title = VIDEO_TITLES[i % VIDEO_TITLES.length];
      const description =
        VIDEO_DESCRIPTIONS[i % VIDEO_DESCRIPTIONS.length] +
        ` This is video #${i + 1} in our series.`;

      // Alternate between thumbnail URLs
      const thumbnailUrl = THUMBNAIL_URLS[i % THUMBNAIL_URLS.length];

      // Randomize some properties
      const isPublic = Math.random() > 0.2; // 80% public
      const views = Math.floor(Math.random() * 10000);
      const likes = Math.floor(Math.random() * 500);
      const dislikes = Math.floor(Math.random() * 50);

      const video = videoFactory.create({
        title,
        description,
        url: VIDEO_URL,
        thumbnailUrl,
        channelId: ChannelId.create(channel.id.value),
        isPublic,
      });

      // Set views, likes, dislikes (they are public properties)
      video.views = views;
      video.likes = likes;
      video.dislikes = dislikes;

      const savedVideo = await videoRepository.create(video);
      console.log(
        `Created video: "${savedVideo.title}" on channel "${channel.name}"`,
      );
    } catch (error) {
      console.error(
        `Error creating video ${i + 1}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  console.log(`Created ${videoCount} videos`);
  console.log('Seed completed successfully!');

  await app.close();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
