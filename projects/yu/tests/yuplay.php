<?php
require_once('simpletest/autorun.php');
require_once('../yuplay.php');

class TestOfyuplay extends UnitTestCase {
    function setUp() {
        $options = array(
            'key'       => 'AI39si6eUylJ3tD5pIKc2c7VOH_KI8mX3-bImclfQB0p4Eqd0Sp7r29EH_8xR3vWcANKffrMm0xhYShI_5UmsKl2mN1z7GSS6Q',
            'client_id' => 'ytapi-FavioManriquezLe-player-3462i3ii-0',
            'username'  => 'Trekstor',
            'password'  => 'n0m4m3s'
        );
        $this->yuplay = new yuplay($options);
    }

    function testCreatePlaylist() {
        $options = array(
            'title' => 'Test',
            'description' => 'This is a test playlist'
        );
        $this->yuplay->createPlaylist($options); 
        $this->assertEqual(true, true);
    }

    function testSavePlaylist() {

    }

    function testRetrievePlaylist() {

    }
}
