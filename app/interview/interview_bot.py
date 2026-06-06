from app.chains.rag_chain import RAG
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_core.messages import AIMessage
from langgraph.checkpoint.memory import MemorySaver
from app.logger.logger_config import logger

class State(TypedDict):
    messages: Annotated[list, add_messages]

class Interview_Bot:

    def __init__(self, interview_id, user_id, company_id):
        self.rag = RAG(user_id, company_id)
        self.memory = MemorySaver()
        self.config = {"configurable": {"thread_id": str(interview_id)}}
        self.graph_builder = StateGraph(State)
        self.graph = self.build_graph()
        self.conversation_summary = ""
        logger.info(f"Interview Bot Initialised for user: {user_id} and company: {company_id}")

    def build_graph(self):
        self.graph_builder.add_node("interview_bot", self.invoke_interview_rag_chain)
        self.graph_builder.add_node("set_attribute", self.set_attr)
        self.graph_builder.add_node("closure", self.closure)
        self.graph_builder.add_edge(START, "interview_bot")
        self.graph_builder.add_conditional_edges("interview_bot", self.is_interview_done, {"Yes": "closure", "No": "set_attribute"})
        self.graph_builder.add_edge("set_attribute", END)
        self.graph_builder.add_edge("closure", END)
        self.state_graph = self.graph_builder.compile(checkpointer=self.memory)
        logger.info("Graph Flow initialised.")
        return self.state_graph

    def invoke_interview_rag_chain(self, state: State):
        logger.debug("Inside Node 'invoke_interview_rag_chain'.")
        response = self.rag.get_rag_chain()
        return {"messages": [AIMessage(response)]}

    def is_interview_done(self, state: State):
        message_history = [message for message in state["messages"][-2:]]
        combined = ""
        for i, msg in enumerate(message_history):
            role = "Candidate" if i % 2 == 0 else "AI Interviewer"
            combined += f'{role}: {msg}\n'
        message_history = combined.strip()
        response = self.rag.get_resume_condition(self.conversation_summary, message_history)
        logger.debug(f"Conditional Node -> Is Interview finished? {response}")
        assert response in ["Yes", "No"], f"Unexpected response from get_resume_condition: {response}"
        return response

    def set_attr(self, state: State):
        logger.debug("Inside Node set_attr")
        if self.conversation_summary == "" and len(state["messages"]) >= 6:
            message_history = [message for message in state["messages"]]
        elif self.conversation_summary != "":
            message_history = [message for message in state["messages"][-2:]]
        else:
            message_history = [message for message in state["messages"]]

        combined = ""
        for i, msg in enumerate(message_history):
            role = "Candidate" if i % 2 == 0 else "AI Interviewer"
            combined += f'{role}: {msg}\n'
        message_history = combined.strip()

        self.conversation_summary = self.rag.generate_summary(self.conversation_summary, message_history)
        logger.info(f"Summary: {self.conversation_summary}")
        logger.info(f"Messages: {message_history}")

        updated_topic = self.rag.get_attr_condn(self.conversation_summary, message_history)
        logger.debug(f'Topic Chosen: {updated_topic}')
        self.rag.set_prompt(updated_topic, history=message_history, summary=self.conversation_summary)
        return state

    def closure(self, state: State):
        return state

    def stream_graph_updates(self, user_input: str):
        for event in self.graph.stream({"messages": [{"role": "human", "content": user_input}]}, config=self.config):
            for key, value in event.items():
                if key == 'interview_bot':
                    value["messages"][-1].pretty_print()
                    return 0, value["messages"][-1].content
                if key == 'closure':
                    return 1, None

    def start_interview(self):
        # ========== 🔒 ORIGINAL CODE ==========
        # First_Time = True
        # result = 0
        # while True:
        #     if result == 1:
        #         break
        #     if First_Time:
        #         user_input, inputs = self.rag.get_dummy_candidate("Hi , nice to meet you.")
        #         response = user_input.invoke(inputs)
        #         First_Time = False
        #     else:
        #         user_input, inputs = self.rag.get_dummy_candidate(question)
        #         response = user_input.invoke(inputs)
        #     print(f'''================================== Candidate Message ==================================\n{response['answer']}''')
        #     result, question = self.stream_graph_updates(response['answer'])

        # ========== ✅ UPDATED LOGIC ==========
        print("💬 AI Interview started. Type your responses below.")
        result = 0
        First_Time = True
        while True:
            if result == 1:
                print("✅ Interview ended.")
                break

            if First_Time:
                user_input = "Hi, nice to meet you."
                First_Time = False
            else:
                user_input = input("👤 You: ")

            print(f"================================== Candidate Message ==================================\n{user_input}")
            result, question = self.stream_graph_updates(user_input)


if __name__ == "__main__":
    interview = Interview_Bot(interview_id=101, user_id=62, company_id=19)
    interview.start_interview()
