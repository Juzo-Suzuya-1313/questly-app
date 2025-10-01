import { Quiz } from "@/types/quiz";

export const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "General Knowledge Quiz",
    description: "Test your knowledge across various topics",
    duration: 300, // 5 minutes
    questions: [
      {
        id: "q1",
        text: "What is the capital of France?",
        options: [
          { id: "o1", text: "London" },
          { id: "o2", text: "Paris" },
          { id: "o3", text: "Berlin" },
          { id: "o4", text: "Madrid" }
        ],
        correctOptionId: "o2"
      },
      {
        id: "q2",
        text: "Which planet is known as the Red Planet?",
        options: [
          { id: "o1", text: "Venus" },
          { id: "o2", text: "Jupiter" },
          { id: "o3", text: "Mars" },
          { id: "o4", text: "Saturn" }
        ],
        correctOptionId: "o3"
      },
      {
        id: "q3",
        text: "What is the largest ocean on Earth?",
        options: [
          { id: "o1", text: "Atlantic Ocean" },
          { id: "o2", text: "Indian Ocean" },
          { id: "o3", text: "Arctic Ocean" },
          { id: "o4", text: "Pacific Ocean" }
        ],
        correctOptionId: "o4"
      },
      {
        id: "q4",
        text: "Who painted the Mona Lisa?",
        options: [
          { id: "o1", text: "Vincent van Gogh" },
          { id: "o2", text: "Leonardo da Vinci" },
          { id: "o3", text: "Pablo Picasso" },
          { id: "o4", text: "Michelangelo" }
        ],
        correctOptionId: "o2"
      },
      {
        id: "q5",
        text: "What is the smallest country in the world?",
        options: [
          { id: "o1", text: "Monaco" },
          { id: "o2", text: "Vatican City" },
          { id: "o3", text: "San Marino" },
          { id: "o4", text: "Liechtenstein" }
        ],
        correctOptionId: "o2"
      }
    ]
  },
  {
    id: "2",
    title: "Science & Technology",
    description: "Challenge your scientific knowledge",
    duration: 240, // 4 minutes
    questions: [
      {
        id: "q1",
        text: "What does CPU stand for?",
        options: [
          { id: "o1", text: "Central Processing Unit" },
          { id: "o2", text: "Computer Personal Unit" },
          { id: "o3", text: "Central Program Utility" },
          { id: "o4", text: "Computer Processing Unit" }
        ],
        correctOptionId: "o1"
      },
      {
        id: "q2",
        text: "What is the speed of light?",
        options: [
          { id: "o1", text: "300,000 km/s" },
          { id: "o2", text: "150,000 km/s" },
          { id: "o3", text: "450,000 km/s" },
          { id: "o4", text: "200,000 km/s" }
        ],
        correctOptionId: "o1"
      },
      {
        id: "q3",
        text: "Which programming language is known as the 'language of the web'?",
        options: [
          { id: "o1", text: "Python" },
          { id: "o2", text: "Java" },
          { id: "o3", text: "JavaScript" },
          { id: "o4", text: "C++" }
        ],
        correctOptionId: "o3"
      },
      {
        id: "q4",
        text: "What is H2O?",
        options: [
          { id: "o1", text: "Oxygen" },
          { id: "o2", text: "Hydrogen" },
          { id: "o3", text: "Water" },
          { id: "o4", text: "Carbon Dioxide" }
        ],
        correctOptionId: "o3"
      }
    ]
  }
];
