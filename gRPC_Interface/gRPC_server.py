import time
import grpc
from concurrent import futures
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import interview_pb2
import interview_pb2_grpc
from app.interview.interview_bot import Interview_Bot  # ✅ Your actual interview logic

class InterviewChatServicer(interview_pb2_grpc.InterviewChatServicer):
    def __init__(self):
        self.bots = {}  # {user_interview_company_key: Interview_Bot instance}

    def getResponse(self, request_iterator, context):
        counter = 0
        bot = None

        for request in request_iterator:
            message = request.message.strip()
            counter += 1
            print(f"📥 Received message #{counter}: {message}")

            if counter == 1:
                # Expect message like: "62 101 19"
                try:
                    user_id, interview_id, company_id = map(int, message.split())
                    bot_key = f"{user_id}_{interview_id}_{company_id}"
                    start = time.time()
                    if bot_key not in self.bots:
                        self.bots[bot_key] = Interview_Bot(
                            interview_id=interview_id,
                            user_id=user_id,
                            company_id=company_id
                        )
                        print(f"✅ Initialized Interview_Bot for key: {bot_key}")
                        # yield interview_pb2.Response(responseLLM="Session initialized. Please start the interview.")
                    bot = self.bots[bot_key]

                    # Start with greeting
                    # result, response = bot.stream_graph_updates("Hi, nice to meet you.")
                    duration = time.time() - start
                    print(f"⏱️ First response time: {duration:.2f}s")

                    # yield interview_pb2.Response(responseLLM=response or "")
                except Exception as e:
                    print(f"❌ Failed to parse first message: {message} - {e}")
                    yield interview_pb2.Response(responseLLM="Invalid first message. Format must be: 'userId interviewId companyId'")
                    break
            else:
                # Process user input
                if not bot:
                    yield interview_pb2.Response(responseLLM="❗ Session not initialized.")
                    break

                try:
                    start = time.time()
                    result, response = bot.stream_graph_updates(message)
                    duration = time.time() - start
                    print(f"📤 Response sent in {duration:.2f}s: {response}")
                    yield interview_pb2.Response(responseLLM=response or "")
                except Exception as e:
                    print(f"❌ Error processing user message: {e}")
                    yield interview_pb2.Response(responseLLM="Error processing your response.")

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    interview_pb2_grpc.add_InterviewChatServicer_to_server(InterviewChatServicer(), server)
    server.add_insecure_port('[::]:9091')
    print("🚀 gRPC Server started on port 9091")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
