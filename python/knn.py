from sklearn.neighbors import KNeighborsClassifier
classes = {
    "car": 0,
    "fish": 1,
    "house": 2,
    "tree": 3,
    "bicycle": 4,
    "guitar": 5,
    "pencil": 6,
    "clock": 7
}

def readFeatureFile(filePath):
    f = open(filePath, "r")
    lines = f.readlines()

    x = []
    y = []
    for i in range(1, len(lines)):
        row = lines[i].split(",")
        x.append([float(row[j]) for j in range(0, len(row)-1)])
        y.append(classes[row[-1].strip()])

    return (x,y)

knn = KNeighborsClassifier(n_neighbors=50, algorithm="brute", weights="uniform")
x, y = readFeatureFile("../data/dataset/training.csv")
knn.fit(x,y)

x,y = readFeatureFile("../data/dataset/testing.csv")
accuracy = knn.score(x,y)
print("Accuracy : {:.2f}%".format(accuracy*100))
