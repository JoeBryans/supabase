import { NextResponse } from "next/server";
import { tool, RealtimeAgent } from '@openai/agents/realtime';


const tutorTool = tool({
    name: "getLesson",
    description: "Fetch an e-learning lesson by topic.",
    getLesson: {
        description: "Fetch an e-learning lesson by topic",
        parameters: {
            type: "object",
            properties: {
                topic: { type: "string" }
            },
            required: ["topic"]
        },
        handler: async ({ topic }: {
            topic: string
        }) => {
            return {
                lesson: `This is the lesson content about ${topic}.`
            };
        }
    },
    saveProgress: {
        description: "Save user progress",
        parameters: {
            type: "object",
            properties: {
                userId: { type: "string" },
                lesson: { type: "string" },
                score: { type: "number" }
            },
            required: ["userId", "lesson", "score"]
        },
        handler: async ({ userId, lesson, score }: {
            userId: string,
            lesson: string,
            score: number
        }) => {
            console.log("Saving progress:", userId, lesson, score);
            return { status: "progress saved" };
        }
    }
} as any);


const agent = new RealtimeAgent({
    name: "Tutor",
    instructions: "You are an AI e-learning assistant. Speak clearly.",
    tools:[ tutorTool]
});
export async function POST() {
    try {
        const session = await openai.realtime
        // ✔ Generate client ephemeral token
        const token = await openai.realtime.sessions.tokens.create({
            session_id: session.id,
            ttl: 60 * 5, // 5 minutes
        });

        return NextResponse.json({
            client_secret: token.client_secret.value,
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Could not create session" },
            { status: 500 }
        );
    }
}
