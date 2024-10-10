import { addJobToRecipeLanguageSimplifierQueue } from '../../queues/languageSimplifierQueue';
import recipeLanguageSimplifierQueue from '../../queues/languageSimplifierQueue';

describe('addJobToRecipeQueue', () => {
  let addSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    addSpy = jest.spyOn(recipeLanguageSimplifierQueue, 'add');
  });

  afterEach(() => {
    addSpy.mockRestore();
  })

  afterAll(async () => {
    await recipeLanguageSimplifierQueue.close();
  })

  it('should add a job to the recipeLanguageSimplifierQueue with correct data', async () => {
    const mockJob = { id: 'test-job-id' };
    addSpy.mockResolvedValue(mockJob);

    const result = await addJobToRecipeLanguageSimplifierQueue({ recipeId: '12345' });

    expect(addSpy).toHaveBeenCalledWith(
      'process-language-simplifier',
      { recipeId: '12345' },
      expect.objectContaining({
        removeOnComplete: true,
      })
    );
    expect(result).toEqual(mockJob);
  });

  it('should throw an error if job addition fails', async () => {
    const mockError = new Error('Failed to add job');
    addSpy.mockRejectedValue(mockError);

    await expect(addJobToRecipeLanguageSimplifierQueue({ recipeId: '12345' }))
      .rejects
      .toThrow('Failed to add job');

    expect(recipeLanguageSimplifierQueue.add).toHaveBeenCalled();
  });
});
