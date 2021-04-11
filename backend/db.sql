CREATE TABLE App(
    app_id INT NOT NULL AUTO_INCREMENT,
    app varchar(255),

    PRIMARY KEY (app_id)
);

CREATE TABLE Test_Type(
    test_type_id INT NOT NULL AUTO_INCREMENT,
    test_type varchar(64),

    PRIMARY KEY (test_type_id)
);

CREATE TABLE Test(
    test_id INT NOT NULL AUTO_INCREMENT,
    app_id INT NOT NULL,
    test_type_id INT NOT NULL,
    test varchar(255),
    execution_time Float(10,3),
    entry_date DATE,
    test_status varchar(64),
    times_run INT,

    PRIMARY KEY (test_id),
    FOREIGN KEY (app_id) REFERENCES App (app_id) ON DELETE CASCADE,
    FOREIGN KEY (test_type_id) REFERENCES Test_Type (test_type_id) ON DELETE CASCADE,
    CONSTRAINT unique_testname UNIQUE (test, app_id, entry_date)
);
ALTER TABLE Test DROP CONSTRAINT unique_testname;
ALTER TABLE Test ADD CONSTRAINT unique_testname UNIQUE (test, app_id, entry_date);
ALTER TABLE Test Modify Column entry_date DateTime;