import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

df = pd.read_csv("movies_dataset.csv")
X =df["Title"]
y =df["Mood"] 

vectorizer = TfidfVectorizer(stop_words = "english")
X_vectorizer = vectorizer.fit_transform(X)

X_train , X_test , y_train , y_test = train_test_split(X_vectorizer , y , test_size = 0.2 , random_state = 42 )

model =LogisticRegression(max_iter = 1000)
model.fit(X_train , y_train)

while True : 

    user_movie = input("Enter a movie name so i can predict your mood rn : ")
    
    if user_movie.lower() == "exit" :
        break

    user_vector = vectorizer.transform([user_movie])
    pred = model.predict(user_vector)

    print("PREDICTED MOOD : ", pred[0])
