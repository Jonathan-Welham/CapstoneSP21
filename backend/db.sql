CREATE TABLE APP(
    appID INT NOT NULL AUTO_INCREMENT,
    app varchar(255),

    PRIMARY KEY (appID)
);

CREATE TABLE TestType(
    testTypeID INT NOT NULL AUTO_INCREMENT,
    testType varchar(64),

    PRIMARY KEY (testTypeID)
);

CREATE TABLE Test(
    testID INT NOT NULL AUTO_INCREMENT,
    appID INT NOT NULL,
    testTypeID INT NOT NULL,
    test varchar(255),
    executionTime Float(10,3),
    entryDate DATE,
    testStatus varchar(64),

    PRIMARY KEY (testID),
    FOREIGN KEY (appID) REFERENCES App (appID) ON DELETE CASCADE,
    FOREIGN KEY (testTypeID) REFERENCES TestType (testTypeID) ON DELETE CASCADE 
);