package net.karazy.cloobster.selenium;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.internal.selenesedriver.FindElements;

public class CheckInTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// Optional, if not specified, WebDriver will search your path for chromedriver.
		  System.setProperty("webdriver.chrome.driver", "/Users/fred/bin/ChromeDriver/chromedriver");
		  
		WebDriver driver = new ChromeDriver();
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		 driver.get("http://localhost:8888/app");
		 
		 //execute tap on checkin button
		 ((JavascriptExecutor) driver).executeScript("var chkInBt = Ext.ComponentQuery.query('dashboard button[action=checkin]')[0]; chkInBt.fireEvent('tap',chkInBt)");
		 List<WebElement> elements = driver.findElements(By.className("x-msgbox"));
		 WebElement msgbox = elements.get(0);
		 WebElement input = msgbox.findElement(By.tagName("input"));
		 input.sendKeys("tst001");
		 
		 
		 //close browser
		 driver.quit();
	}

}
