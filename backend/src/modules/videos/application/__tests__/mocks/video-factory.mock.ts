import { VideoFactory } from '../../../domain/factories/video.factory';

export interface VideoFactoryMocks {
  create: jest.Mock;
  reconstitute: jest.Mock;
  factory: jest.Mocked<VideoFactory>;
}

export function createVideoFactoryMocks(): VideoFactoryMocks {
  const create = jest.fn();
  const reconstitute = jest.fn();

  const factory = {
    create,
    reconstitute,
  } as jest.Mocked<VideoFactory>;

  return {
    create,
    reconstitute,
    factory,
  };
}
