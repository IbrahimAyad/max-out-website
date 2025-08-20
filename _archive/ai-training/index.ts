#!/usr/bin/env tsx

import { TrainingPipeline } from './train';
import { AIEvaluator } from './evaluation/evaluate';
import { startServer } from './api/server';
import { Command } from 'commander';

const program = new Command();

program
  .name('kct-ai-training')
  .description('KCT Menswear AI Training Pipeline')
  .version('1.0.0');

program
  .command('train')
  .description('Run the complete training pipeline')
  .option('--recreate', 'Recreate vector database collection')
  .action(async (options) => {
    try {
      if (options.recreate) {
        process.env.RECREATE_COLLECTION = 'true';
      }
      
      await pipeline.run();
      
    } catch (error) {
      console.error('❌ Training failed:', error);
      process.exit(1);
    }
  });

program
  .command('evaluate')
  .description('Evaluate the trained AI system')
  .action(async () => {
    try {
      await evaluator.runEvaluation();
      
    } catch (error) {
      console.error('❌ Evaluation failed:', error);
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Start the AI API server')
  .option('-p, --port <port>', 'Port to run the server on', '3001')
  .action(async (options) => {
    try {
      if (options.port) {
        process.env.AI_API_PORT = options.port;
      }
      
    } catch (error) {
      console.error('❌ Server failed to start:', error);
      process.exit(1);
    }
  });

program
  .command('full')
  .description('Run training, evaluation, and start server')
  .action(async () => {
    try {
      // Run training
      await pipeline.run();
      
      const evaluator = new AIEvaluator();
      await evaluator.runEvaluation();
      
      await startServer();
    } catch (error) {
      console.error('❌ Full pipeline failed:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);