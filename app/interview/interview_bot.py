from app.chains.rag_chain import RAG
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_core.messages import AIMessage , HumanMessage
from langgraph.checkpoint.memory import MemorySaver

class State(TypedDict):
    messages: Annotated[list, add_messages]
    
class Interview_Bot:
    def __init__(self,interview_id,user_id,company_id):
        self.rag=RAG(user_id,company_id)
        self.rag_chain=self.rag.get_rag_chain()
        self.memory = MemorySaver()
        self.config = {"configurable": {"thread_id": str(interview_id)}}
        self.graph_builder = StateGraph(State)
        self.graph=self.build_graph()

    def build_graph(self):
        self.graph_builder.add_node("interview_bot", self.invoke_interview_rag_chain)
        self.graph_builder.add_node("set_attribute",self.set_attr)
        self.graph_builder.add_node("closure",self.closure)
        self.graph_builder.add_edge(START, "interview_bot")
        self.graph_builder.add_conditional_edges("interview_bot", self.is_interview_done , {"Yes": "closure" , "No": "set_attribute"})
        self.graph_builder.add_edge("set_attribute", END)
        self.graph_builder.add_edge("closure",END)
        self.state_graph = self.graph_builder.compile(checkpointer=self.memory)
        return self.state_graph

    #Retrieval
    def invoke_interview_rag_chain(self,state: State):
        # print(state["messages"])
        # print(state["messages"][-1].content)
        response=self.rag_chain.invoke({'input':state["messages"][-1].content , 'company_name':'Amazon','job_role':'Backend Engineer'})
        # print(AIMessage(response['answer']))
        return {"messages": [AIMessage(response['answer'])]}

    def is_interview_done(self,state: State):
        message_history=[message for message in state["messages"]]
        combined=""
        for i,msg in enumerate(message_history):
            role="Candidate" if i%2==0 else "AI Interviewer"
            combined+=f'{role}: {msg}\n'
        message_history=combined.strip()
        response=self.rag.get_resume_condition(message_history)
        return response
        
    def set_attr(self,state: State):
        return state

    def closure(self,state: State):
        return state
    
    #Stream the Updates
    def stream_graph_updates(self,user_input: str):
        for event in self.graph.stream({"messages": [{"role": "human", "content": user_input}]},config=self.config):
            for key,value in event.items():
                if key=='interview_bot':
                    value["messages"][-1].pretty_print()
                    return 0 , value["messages"][-1].content
                if key=='closure':
                    return 1,None
                # print(value["messages"])
                

    def start_interview(self):
        First_Time=True
        result=0
        while True:
            if result==1:
                break
            if First_Time:
                user_input,inputs = self.rag.get_dummy_candidate("Introduce Yourself")
                response=user_input.invoke(inputs)
                First_Time=False
            else:
                user_input,inputs=self.rag.get_dummy_candidate(question)
                response=user_input.invoke(inputs)
            print(f'''================================== Candidate Message ==================================
                     {response['answer']}''')
            result,question=self.stream_graph_updates(response['answer'])

    
interview=Interview_Bot(101,62,19)
interview.start_interview()