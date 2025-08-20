import { NextRequest, NextResponse } from 'next/server';
import { agentSystem } from '@/lib/agents';

// GET /api/agents - Get agent system status
export async function GET(request: NextRequest) {
  try {
    const health = await agentSystem.getSystemHealth();
    const isRunning = agentSystem.isSystemRunning();
    const decisions = agentSystem.getDecisionLog().slice(-10); // Last 10 decisions

    return NextResponse.json({
      status: 'success',
      data: {
        isRunning,
        health,
        recentDecisions: decisions,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {

    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to get agent system status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/start - Start the agent system
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'start') {
      await agentSystem.start();
      return NextResponse.json({
        status: 'success',
        message: 'Agent system started successfully'
      });
    } else if (action === 'stop') {
      await agentSystem.stop();
      return NextResponse.json({
        status: 'success',
        message: 'Agent system stopped successfully'
      });
    } else if (action === 'inject-task') {
      const body = await request.json();
      const task = body.task;

      if (!task) {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Task is required' 
          },
          { status: 400 }
        );
      }

      await agentSystem.injectTask(task);
      return NextResponse.json({
        status: 'success',
        message: 'Task injected successfully',
        task
      });
    } else {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid action. Use start, stop, or inject-task' 
        },
        { status: 400 }
      );
    }
  } catch (error) {

    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to control agent system' 
      },
      { status: 500 }
    );
  }
}